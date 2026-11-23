from fastapi import APIRouter

from app.api.v1 import admin, model, predictions

router = APIRouter()
router.include_router(predictions.router)
router.include_router(model.router)
router.include_router(admin.router)
