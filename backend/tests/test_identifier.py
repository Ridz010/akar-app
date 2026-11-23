import json

import httpx
import pytest

from app.core.config import get_settings
from app.core.errors import AppError
from app.services.identifier import Analysis, OpenRouterIdentifier, aggregate, parse_analysis
from tests.conftest import SPECIES

LABELS = {"rhizophora_mucronata", "avicennia_marina"}


def answer(label: str, confidence: float, **extra) -> dict:
    return {
        "photo_quality": "good",
        "photo_feedback": "",
        "is_leaf": True,
        "observed_traits": ["Ujung daun berduri kecil", "Daun tebal seperti kulit"],
        "candidates": [{"label": label, "confidence": confidence}],
        **extra,
    }


def analysis(label: str | None, confidence: float = 0.8, quality="good", is_leaf=True):
    return Analysis(
        is_leaf=is_leaf,
        photo_quality=quality,
        photo_feedback="Foto terlalu gelap." if quality != "good" else None,
        observed_traits=[f"ciri {label}"] if label else [],
        candidates=[(label, confidence)] if label else [],
    )


def test_parse_analysis_drops_unknown_and_sorts():
    content = json.dumps(
        answer(
            "x",
            0,
            candidates=[
                {"label": "unknown", "confidence": 0.3},
                {"label": "avicennia_marina", "confidence": 0.2},
                {"label": "rhizophora_mucronata", "confidence": 0.5},
            ],
        )
    )
    parsed = parse_analysis(content, LABELS)
    assert parsed.candidates == [("rhizophora_mucronata", 0.5), ("avicennia_marina", 0.2)]
    assert parsed.observed_traits == ["Ujung daun berduri kecil", "Daun tebal seperti kulit"]
    assert parsed.photo_feedback is None


def test_parse_analysis_normalises_overconfident_output():
    content = json.dumps(
        answer(
            "x",
            0,
            candidates=[
                {"label": "rhizophora_mucronata", "confidence": 1.4},
                {"label": "avicennia_marina", "confidence": 1.0},
            ],
        )
    )
    parsed = parse_analysis(content, LABELS)
    assert sum(value for _, value in parsed.candidates) == pytest.approx(1.0)


def test_aggregate_averages_and_measures_agreement():
    ranking = aggregate(
        [
            analysis("rhizophora_mucronata", 0.9),
            analysis("rhizophora_mucronata", 0.6),
            analysis("avicennia_marina", 0.7),
        ]
    )
    assert ranking.candidates[0] == ("rhizophora_mucronata", pytest.approx(0.5))
    assert ranking.candidates[1] == ("avicennia_marina", pytest.approx(0.7 / 3))
    assert ranking.agreement == pytest.approx(0.667, abs=1e-3)
    assert ranking.observed_traits == ["ciri rhizophora_mucronata"]


def test_aggregate_uses_median_photo_quality():
    ranking = aggregate(
        [
            analysis("rhizophora_mucronata", quality="poor"),
            analysis("rhizophora_mucronata", quality="poor"),
            analysis("rhizophora_mucronata", quality="good"),
        ]
    )
    assert ranking.photo_quality == "poor"
    assert ranking.photo_feedback == "Foto terlalu gelap."


def test_aggregate_majority_not_leaf():
    ranking = aggregate(
        [analysis(None, is_leaf=False), analysis(None, is_leaf=False), analysis("avicennia_marina")]
    )
    assert not ranking.is_leaf
    assert ranking.candidates == []


async def test_openrouter_ensemble_request_and_response(monkeypatch):
    settings = get_settings()
    monkeypatch.setattr(settings, "openrouter_api_key", "sk-or-test")
    monkeypatch.setattr(settings, "identify_samples", 3)
    requests: list[dict] = []

    def handler(request: httpx.Request) -> httpx.Response:
        body = json.loads(request.content)
        requests.append({"auth": request.headers["Authorization"], "body": body})
        content = json.dumps(answer("avicennia_marina", 0.7))
        return httpx.Response(200, json={"choices": [{"message": {"content": content}}]})

    async with httpx.AsyncClient(transport=httpx.MockTransport(handler)) as client:
        ranking = await OpenRouterIdentifier(settings, client).identify(
            ["data:image/jpeg;base64,FULL", "data:image/jpeg;base64,CROP"], SPECIES
        )

    assert ranking.candidates == [("avicennia_marina", pytest.approx(0.7))]
    assert ranking.agreement == 1.0
    assert len(requests) == 3
    assert {r["auth"] for r in requests} == {"Bearer sk-or-test"}
    bodies = [r["body"] for r in requests]
    assert [b["temperature"] for b in bodies] == [0.0, 0.4, 0.4]
    images = [b["messages"][1]["content"][1]["image_url"]["url"] for b in bodies]
    assert images == [
        "data:image/jpeg;base64,FULL",
        "data:image/jpeg;base64,CROP",
        "data:image/jpeg;base64,FULL",
    ]
    schema = bodies[0]["response_format"]["json_schema"]["schema"]
    label_enum = schema["properties"]["candidates"]["items"]["properties"]["label"]["enum"]
    assert label_enum == ["rhizophora_mucronata", "avicennia_marina", "unknown"]
    assert bodies[0]["model"] == "openai/gpt-4o-mini"


async def test_partial_failures_still_return_result(monkeypatch):
    settings = get_settings()
    monkeypatch.setattr(settings, "openrouter_api_key", "sk-or-test")
    calls = {"n": 0}

    def handler(_: httpx.Request) -> httpx.Response:
        calls["n"] += 1
        if calls["n"] == 1:
            return httpx.Response(429, json={"error": "rate"})
        content = json.dumps(answer("rhizophora_mucronata", 0.9))
        return httpx.Response(200, json={"choices": [{"message": {"content": content}}]})

    async with httpx.AsyncClient(transport=httpx.MockTransport(handler)) as client:
        ranking = await OpenRouterIdentifier(settings, client).identify(["data:,"], SPECIES)

    assert ranking.candidates[0][0] == "rhizophora_mucronata"


async def test_all_failures_map_to_503(monkeypatch):
    settings = get_settings()
    monkeypatch.setattr(settings, "openrouter_api_key", "sk-or-test")

    async with httpx.AsyncClient(
        transport=httpx.MockTransport(lambda _: httpx.Response(429, json={"error": "rate"}))
    ) as client:
        with pytest.raises(AppError) as error:
            await OpenRouterIdentifier(settings, client).identify(["data:,"], SPECIES)

    assert error.value.status == 503
    assert error.value.code == "model_unavailable"


async def test_missing_key_maps_to_503(monkeypatch):
    settings = get_settings()
    monkeypatch.setattr(settings, "openrouter_api_key", "")
    async with httpx.AsyncClient() as client:
        with pytest.raises(AppError) as error:
            await OpenRouterIdentifier(settings, client).identify(["data:,"], SPECIES)
    assert error.value.code == "model_unavailable"
