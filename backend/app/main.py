import logging
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

import httpx
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import ValidationError

from app.api.v1.router import router as v1_router
from app.core.config import Settings, get_settings
from app.core.errors import error_body, register_error_handlers
from app.services.identifier import OpenRouterIdentifier

logger = logging.getLogger("akar")

SERVICE_INFO = {
    "service": "AKAR Backend",
    "docs": "/docs",
    "health": "/health",
}


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    settings = get_settings()
    async with httpx.AsyncClient() as client:
        app.state.identifier = OpenRouterIdentifier(settings, client)
        if not app.state.identifier.configured:
            logger.warning(
                "OPENROUTER_API_KEY kosong: identifikasi spesies akan mengembalikan 503."
            )
        yield


def create_app(settings: Settings) -> FastAPI:
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

    @app.get("/", include_in_schema=False)
    def root() -> dict[str, str]:
        return {**SERVICE_INFO, "status": "ok"}

    @app.get("/health", tags=["health"])
    def health() -> dict[str, object]:
        identifier = getattr(app.state, "identifier", None)
        return {
            "status": "ok",
            "model_version": settings.model_version,
            "model_loaded": bool(identifier and identifier.configured),
        }

    return app


def create_misconfigured_app(missing: list[str]) -> FastAPI:
    app = FastAPI(title="AKAR Backend", version="1.0.0")
    message = "Backend belum dikonfigurasi. Isi environment variable: " + ", ".join(missing)

    @app.get("/health", tags=["health"])
    def health() -> JSONResponse:
        return JSONResponse(
            {"status": "misconfigured", "missing_env": missing, "model_loaded": False},
            status_code=503,
        )

    @app.api_route("/{path:path}", methods=["GET", "POST"], include_in_schema=False)
    def unavailable(_: Request, path: str) -> JSONResponse:
        return JSONResponse(error_body("misconfigured", message), status_code=503)

    return app


def build_app() -> FastAPI:
    try:
        settings = get_settings()
    except ValidationError as error:
        missing = sorted(
            {str(issue["loc"][0]).upper() for issue in error.errors() if issue.get("loc")}
        )
        logger.error("Konfigurasi backend tidak lengkap: %s", ", ".join(missing))
        return create_misconfigured_app(missing)
    return create_app(settings)


app = build_app()
