from fastapi import APIRouter, Depends
from starlette.concurrency import run_in_threadpool

from app.api.deps import get_current_user, get_repository, settings_dependency
from app.core.config import Settings
from app.core.security import CurrentUser
from app.schemas.prediction import ModelInfo, Thresholds
from app.services.repository import Repository

router = APIRouter(prefix="/model", tags=["model"])

METHOD = (
    "ensemble: analisis ciri daun terstruktur pada foto utuh dan potongan tengah, "
    "rata-rata keyakinan, gerbang kualitas foto dan kesepakatan"
)


@router.get("", response_model=ModelInfo)
async def model_info(
    _: CurrentUser = Depends(get_current_user),
    settings: Settings = Depends(settings_dependency),
    repository: Repository = Depends(get_repository),
) -> ModelInfo:
    options = await run_in_threadpool(repository.supported_species)
    return ModelInfo(
        version=settings.model_version,
        provider="openrouter",
        method=METHOD,
        samples=settings.identify_samples,
        labels=[option.model_label for option in options],
        thresholds=Thresholds(
            confident=settings.confident_threshold, review=settings.review_threshold
        ),
    )
