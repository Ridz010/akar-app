import asyncio
import json
import logging
from dataclasses import dataclass, field
from pathlib import Path
from statistics import median
from typing import Literal, Protocol

import httpx

from app.core.config import Settings
from app.core.errors import AppError

logger = logging.getLogger("akar.identifier")

UNKNOWN_LABEL = "unknown"
PhotoQuality = Literal["good", "fair", "poor"]
QUALITY_SCORE: dict[PhotoQuality, int] = {"poor": 0, "fair": 1, "good": 2}
QUALITY_BY_SCORE: dict[int, PhotoQuality] = {score: q for q, score in QUALITY_SCORE.items()}
MAX_TRAITS = 5


def model_unavailable() -> AppError:
    return AppError(
        503,
        "model_unavailable",
        "Layanan identifikasi sedang tidak tersedia. Coba beberapa saat lagi.",
    )


@dataclass(frozen=True)
class SpeciesOption:
    id: str
    model_label: str
    scientific_name: str
    local_name: str | None
    leaf_traits: str | None
    family: str | None = None


@dataclass(frozen=True)
class Analysis:
    is_leaf: bool
    photo_quality: PhotoQuality
    photo_feedback: str | None
    observed_traits: list[str]
    candidates: list[tuple[str, float]]


@dataclass(frozen=True)
class Ranking:
    is_leaf: bool
    candidates: list[tuple[str, float]]
    observed_traits: list[str] = field(default_factory=list)
    photo_quality: PhotoQuality = "good"
    photo_feedback: str | None = None
    agreement: float = 1.0


class Identifier(Protocol):
    @property
    def configured(self) -> bool: ...

    async def identify(
        self, image_data_urls: list[str], options: list[SpeciesOption]
    ) -> Ranking: ...


SYSTEM_PROMPT = (Path(__file__).with_name("leaf_prompt.txt")).read_text(encoding="utf-8")


def build_catalog(options: list[SpeciesOption]) -> str:
    lines = []
    for option in options:
        name = option.scientific_name
        if option.local_name:
            name += f" ({option.local_name})"
        if option.family:
            name += f", suku {option.family}"
        traits = option.leaf_traits or "ciri daun belum dicatat"
        lines.append(f"- label: {option.model_label}; spesies: {name}; ciri pembeda: {traits}")
    return "\n".join(lines)


def build_response_format(labels: list[str]) -> dict:
    return {
        "type": "json_schema",
        "json_schema": {
            "name": "leaf_identification",
            "strict": True,
            "schema": {
                "type": "object",
                "additionalProperties": False,
                "required": [
                    "photo_quality",
                    "photo_feedback",
                    "is_leaf",
                    "observed_traits",
                    "candidates",
                ],
                "properties": {
                    "photo_quality": {"type": "string", "enum": ["good", "fair", "poor"]},
                    "photo_feedback": {"type": "string"},
                    "is_leaf": {"type": "boolean"},
                    "observed_traits": {"type": "array", "items": {"type": "string"}},
                    "candidates": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "additionalProperties": False,
                            "required": ["label", "confidence"],
                            "properties": {
                                "label": {"type": "string", "enum": [*labels, UNKNOWN_LABEL]},
                                "confidence": {"type": "number"},
                            },
                        },
                    },
                },
            },
        },
    }


def _clean_traits(raw: object) -> list[str]:
    if not isinstance(raw, list):
        return []
    traits: list[str] = []
    for item in raw:
        text = str(item).strip().rstrip(".")
        if text and text.lower() not in {trait.lower() for trait in traits}:
            traits.append(text[:120])
    return traits[:MAX_TRAITS]


def parse_analysis(content: str, labels: set[str]) -> Analysis:
    payload = json.loads(content)
    best: dict[str, float] = {}
    for item in payload.get("candidates", []):
        label = item.get("label")
        if label not in labels:
            continue
        confidence = min(max(float(item.get("confidence", 0)), 0.0), 1.0)
        best[label] = max(best.get(label, 0.0), confidence)

    total = sum(best.values())
    if total > 1:
        best = {label: value / total for label, value in best.items()}

    quality = payload.get("photo_quality")
    feedback = str(payload.get("photo_feedback") or "").strip()
    return Analysis(
        is_leaf=bool(payload.get("is_leaf")),
        photo_quality=quality if quality in QUALITY_SCORE else "fair",
        photo_feedback=feedback[:200] or None,
        observed_traits=_clean_traits(payload.get("observed_traits")),
        candidates=sorted(best.items(), key=lambda pair: pair[1], reverse=True),
    )


def aggregate(analyses: list[Analysis]) -> Ranking:
    count = len(analyses)
    leaf_votes = sum(1 for analysis in analyses if analysis.is_leaf)
    is_leaf = leaf_votes * 2 >= count

    totals: dict[str, float] = {}
    for analysis in analyses:
        if not analysis.is_leaf:
            continue
        for label, confidence in analysis.candidates:
            totals[label] = totals.get(label, 0.0) + confidence
    averaged = sorted(
        ((label, total / count) for label, total in totals.items()),
        key=lambda pair: pair[1],
        reverse=True,
    )

    top_label = averaged[0][0] if averaged else None
    agreeing = [
        analysis
        for analysis in analyses
        if analysis.is_leaf and analysis.candidates and analysis.candidates[0][0] == top_label
    ]
    agreement = len(agreeing) / count if top_label else (count - leaf_votes) / count

    quality_score = int(median(QUALITY_SCORE[analysis.photo_quality] for analysis in analyses))
    photo_quality = QUALITY_BY_SCORE[quality_score]
    feedback = next(
        (analysis.photo_feedback for analysis in analyses if analysis.photo_feedback), None
    )

    source = max(agreeing, key=lambda a: a.candidates[0][1]) if agreeing else analyses[0]
    return Ranking(
        is_leaf=is_leaf,
        candidates=averaged[:5] if is_leaf else [],
        observed_traits=source.observed_traits,
        photo_quality=photo_quality,
        photo_feedback=feedback if photo_quality != "good" else None,
        agreement=round(agreement, 3),
    )


class OpenRouterIdentifier:
    def __init__(self, settings: Settings, client: httpx.AsyncClient) -> None:
        self._settings = settings
        self._client = client

    @property
    def configured(self) -> bool:
        return bool(self._settings.openrouter_api_key)

    def _request_body(
        self, image_data_url: str, options: list[SpeciesOption], temperature: float
    ) -> dict:
        settings = self._settings
        labels = [option.model_label for option in options]
        return {
            "model": settings.openrouter_model,
            "temperature": temperature,
            "max_tokens": 600,
            "response_format": build_response_format(labels),
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": "Kandidat spesies:\n" + build_catalog(options)},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": image_data_url,
                                "detail": settings.openrouter_image_detail,
                            },
                        },
                    ],
                },
            ],
        }

    async def _analyse(
        self, image_data_url: str, options: list[SpeciesOption], temperature: float
    ) -> Analysis:
        settings = self._settings
        headers = {
            "Authorization": f"Bearer {settings.openrouter_api_key}",
            "HTTP-Referer": settings.app_url,
            "X-Title": "AKAR",
        }
        response = await self._client.post(
            f"{settings.openrouter_base_url}/chat/completions",
            json=self._request_body(image_data_url, options, temperature),
            headers=headers,
            timeout=settings.openrouter_timeout_seconds,
        )
        response.raise_for_status()
        content = response.json()["choices"][0]["message"]["content"]
        return parse_analysis(content, {option.model_label for option in options})

    async def identify(self, image_data_urls: list[str], options: list[SpeciesOption]) -> Ranking:
        if not self.configured or not image_data_urls:
            raise model_unavailable()

        samples = self._settings.identify_samples
        jobs = [
            self._analyse(
                image_data_urls[index % len(image_data_urls)],
                options,
                0.0 if index == 0 else self._settings.sample_temperature,
            )
            for index in range(samples)
        ]
        results = await asyncio.gather(*jobs, return_exceptions=True)

        analyses = [result for result in results if isinstance(result, Analysis)]
        for result in results:
            if isinstance(result, httpx.HTTPStatusError):
                logger.error(
                    "OpenRouter menolak permintaan: %s %s",
                    result.response.status_code,
                    result.response.text[:500],
                )
            elif isinstance(result, BaseException):
                logger.error("Analisis OpenRouter gagal: %r", result)

        if not analyses:
            raise model_unavailable()
        return aggregate(analyses)
