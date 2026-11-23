from uuid import UUID

from fastapi import APIRouter, Depends, File, UploadFile, status

from app.api.deps import get_current_user, get_identifier, get_repository, settings_dependency
from app.core.config import Settings
from app.core.security import CurrentUser
from app.schemas.prediction import PredictionOut
from app.services import predictions as service
from app.services.identifier import Identifier
from app.services.repository import Repository

router = APIRouter(prefix="/predictions", tags=["predictions"])


@router.post("", response_model=PredictionOut, status_code=status.HTTP_201_CREATED)
async def create_prediction(
    image: UploadFile = File(...),
    user: CurrentUser = Depends(get_current_user),
    settings: Settings = Depends(settings_dependency),
    identifier: Identifier = Depends(get_identifier),
    repository: Repository = Depends(get_repository),
) -> PredictionOut:
    data = await image.read(settings.max_upload_bytes + 1)
    return await service.identify_and_record(
        data, user, settings=settings, identifier=identifier, repository=repository
    )


@router.get("/{prediction_id}", response_model=PredictionOut)
async def get_prediction(
    prediction_id: UUID,
    user: CurrentUser = Depends(get_current_user),
    repository: Repository = Depends(get_repository),
) -> PredictionOut:
    return await service.get_for_user(str(prediction_id), user, repository=repository)
