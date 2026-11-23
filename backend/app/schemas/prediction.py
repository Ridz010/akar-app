from typing import Literal
from uuid import UUID

from pydantic import BaseModel, Field

PredictionStatus = Literal["confident", "needs_review", "unrecognized"]
PhotoQuality = Literal["good", "fair", "poor"]


class SpeciesRef(BaseModel):
    id: UUID
    scientific_name: str
    local_name: str | None
    family: str | None = None
    leaf_traits: str | None = None


class Candidate(BaseModel):
    label: str
    local_name: str | None = None
    confidence: float = Field(ge=0, le=1)


class PredictionOut(BaseModel):
    id: UUID
    prediction_status: PredictionStatus
    predicted_label: str | None
    species: SpeciesRef | None
    confidence: float = Field(ge=0, le=1)
    top_k: list[Candidate]
    observed_traits: list[str] = []
    photo_quality: PhotoQuality | None = None
    photo_feedback: str | None = None
    agreement: float | None = Field(default=None, ge=0, le=1)
    model_version: str
    photo_path: str


class Thresholds(BaseModel):
    confident: float
    review: float


class ModelInfo(BaseModel):
    version: str
    provider: str
    method: str
    samples: int
    labels: list[str]
    thresholds: Thresholds
