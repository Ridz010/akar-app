import logging
from typing import Any
from uuid import uuid4

from starlette.concurrency import run_in_threadpool

from app.core.config import Settings
from app.core.errors import AppError
from app.core.security import CurrentUser
from app.schemas.prediction import Candidate, PredictionOut, PredictionStatus, SpeciesRef
from app.services.identifier import Identifier, Ranking, SpeciesOption
from app.services.images import prepare_image
from app.services.repository import Repository

logger = logging.getLogger("akar.predictions")

MIN_AGREEMENT_FOR_CONFIDENT = 0.6


def classify(
    ranking: Ranking,
    by_label: dict[str, SpeciesOption],
    settings: Settings,
) -> tuple[PredictionStatus, SpeciesOption | None, float]:
    if not ranking.is_leaf or not ranking.candidates:
        return "unrecognized", None, 0.0

    top_label, top_confidence = ranking.candidates[0]
    species = by_label.get(top_label)
    if species is None or top_confidence < settings.review_threshold:
        return "unrecognized", None, top_confidence

    trustworthy = (
        ranking.photo_quality != "poor" and ranking.agreement >= MIN_AGREEMENT_FOR_CONFIDENT
    )
    if top_confidence >= settings.confident_threshold and trustworthy:
        return "confident", species, top_confidence
    return "needs_review", species, top_confidence


def _species_ref(species: SpeciesOption | dict[str, Any] | None) -> SpeciesRef | None:
    if species is None:
        return None
    if isinstance(species, SpeciesOption):
        return SpeciesRef(
            id=species.id,
            scientific_name=species.scientific_name,
            local_name=species.local_name,
            family=species.family,
            leaf_traits=species.leaf_traits,
        )
    return SpeciesRef(**species)


async def identify_and_record(
    data: bytes,
    user: CurrentUser,
    *,
    settings: Settings,
    identifier: Identifier,
    repository: Repository,
) -> PredictionOut:
    if len(data) > settings.max_upload_bytes:
        limit_mb = settings.max_upload_bytes // (1024 * 1024)
        raise AppError(413, "image_too_large", f"Ukuran foto maksimal {limit_mb} MB.")

    image = await run_in_threadpool(prepare_image, data)

    options = await run_in_threadpool(repository.supported_species)
    if not options:
        raise AppError(
            503,
            "species_catalog_empty",
            "Daftar spesies belum disiapkan pengelola. Coba lagi nanti.",
        )
    by_label = {option.model_label: option for option in options}

    ranking = await identifier.identify(image.model_data_urls, options)
    status, species, confidence = classify(ranking, by_label, settings)
    top_k = [
        Candidate(
            label=by_label[label].scientific_name,
            local_name=by_label[label].local_name,
            confidence=value,
        )
        for label, value in ranking.candidates
    ]

    path = f"{user.id}/{uuid4()}.jpg"
    await run_in_threadpool(repository.upload_photo, path, image.storage_jpeg)

    try:
        row = await run_in_threadpool(
            repository.insert_prediction,
            {
                "user_id": user.id,
                "photo_path": path,
                "prediction_status": status,
                "predicted_label": species.model_label if species else None,
                "species_id": species.id if species else None,
                "confidence": confidence,
                "top_k": [candidate.model_dump() for candidate in top_k],
                "observed_traits": ranking.observed_traits,
                "photo_quality": ranking.photo_quality,
                "photo_feedback": ranking.photo_feedback,
                "agreement": ranking.agreement,
                "model_version": settings.model_version,
            },
        )
    except Exception:
        logger.exception("Gagal menyimpan prediksi, foto %s dihapus", path)
        await run_in_threadpool(repository.remove_photo, path)
        raise

    return PredictionOut(
        id=row["id"],
        prediction_status=status,
        predicted_label=species.model_label if species else None,
        species=_species_ref(species),
        confidence=confidence,
        top_k=top_k,
        observed_traits=ranking.observed_traits,
        photo_quality=ranking.photo_quality,
        photo_feedback=ranking.photo_feedback,
        agreement=ranking.agreement,
        model_version=settings.model_version,
        photo_path=path,
    )


async def get_for_user(
    prediction_id: str, user: CurrentUser, *, repository: Repository
) -> PredictionOut:
    row = await run_in_threadpool(repository.find_prediction, prediction_id, user.token)
    if row is None:
        raise AppError(404, "not_found", "Prediksi tidak ditemukan.")
    return PredictionOut(
        id=row["id"],
        prediction_status=row["prediction_status"],
        predicted_label=row["predicted_label"],
        species=_species_ref(row.get("species")),
        confidence=row["confidence"],
        top_k=[Candidate(**candidate) for candidate in row.get("top_k") or []],
        observed_traits=row.get("observed_traits") or [],
        photo_quality=row.get("photo_quality"),
        photo_feedback=row.get("photo_feedback"),
        agreement=row.get("agreement"),
        model_version=row["model_version"],
        photo_path=row["photo_path"],
    )
