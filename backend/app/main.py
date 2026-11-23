import logging
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

import httpx
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import router as v1_router
from app.core.config import get_settings
from app.core.errors import register_error_handlers
from app.services.identifier import OpenRouterIdentifier


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    settings = get_settings()
    async with httpx.AsyncClient() as client:
        app.state.identifier = OpenRouterIdentifier(settings, client)
        if not app.state.identifier.configured:
            logging.getLogger("akar").warning(
                "OPENROUTER_API_KEY kosong: identifikasi spesies akan mengembalikan 503."
            )
        yield


def create_app() -> FastAPI:
    settings = get_settings()
    logging.basicConfig(level=settings.log_level)

    app = FastAPI(title="AKAR Backend", version="1.0.0", lifespan=lifespan)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origin_list,
        allow_methods=["GET", "POST"],
        allow_headers=["Authorization", "Content-Type"],
    )
    register_error_handlers(app)
    app.include_router(v1_router, prefix="/v1")

    @app.get("/health", tags=["health"])
    def health() -> dict[str, object]:
        identifier = getattr(app.state, "identifier", None)
        return {
            "status": "ok",
            "model_version": settings.model_version,
            "model_loaded": bool(identifier and identifier.configured),
        }

    return app


app = create_app()
