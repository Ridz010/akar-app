from functools import lru_cache
from typing import Literal

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    supabase_url: str
    supabase_publishable_key: str
    supabase_secret_key: str
    supabase_jwt_audience: str = "authenticated"
    storage_bucket: str = "observation-photos"

    openrouter_api_key: str = ""
    openrouter_model: str = "openai/gpt-4o-mini"
    openrouter_base_url: str = "https://openrouter.ai/api/v1"
    openrouter_image_detail: Literal["low", "high", "auto"] = "high"
    openrouter_timeout_seconds: float = Field(25, gt=0)
    app_url: str = "http://localhost:3000"
    identify_samples: int = Field(3, ge=1, le=5)
    sample_temperature: float = Field(0.4, ge=0, le=1)

    confident_threshold: float = Field(0.80, ge=0, le=1)
    review_threshold: float = Field(0.50, ge=0, le=1)
    max_upload_bytes: int = Field(5 * 1024 * 1024, gt=0)

    cors_origins: str = ""
    log_level: str = "INFO"

    @property
    def jwks_url(self) -> str:
        return f"{self.supabase_url}/auth/v1/.well-known/jwks.json"

    @property
    def jwt_issuer(self) -> str:
        return f"{self.supabase_url}/auth/v1"

    @property
    def model_version(self) -> str:
        return f"openrouter/{self.openrouter_model}"

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
