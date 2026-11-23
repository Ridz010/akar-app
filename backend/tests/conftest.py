import io
import os
from typing import Any

os.environ.setdefault("SUPABASE_URL", "https://example.supabase.co")
os.environ.setdefault("SUPABASE_PUBLISHABLE_KEY", "sb_publishable_test")
os.environ.setdefault("SUPABASE_SECRET_KEY", "sb_secret_test")
os.environ.setdefault("OPENROUTER_API_KEY", "")

import pytest
from fastapi.testclient import TestClient
from PIL import Image

from app.api.deps import get_current_user, get_identifier, get_repository
from app.core.config import get_settings
from app.core.security import CurrentUser
from app.main import create_app
from app.services.identifier import Ranking, SpeciesOption

USER = CurrentUser(
    id="11111111-1111-1111-1111-111111111111", email=None, role="community", token="t"
)
ADMIN = CurrentUser(id="22222222-2222-2222-2222-222222222222", email=None, role="admin", token="t")

SPECIES = [
    SpeciesOption(
        id="aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        model_label="rhizophora_mucronata",
        scientific_name="Rhizophora mucronata",
        local_name="Bakau hitam",
        leaf_traits="Ujung daun runcing seperti duri.",
        family="Rhizophoraceae",
    ),
    SpeciesOption(
        id="bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
        model_label="avicennia_marina",
        scientific_name="Avicennia marina",
        local_name="Api-api putih",
        leaf_traits="Bagian bawah daun keputihan.",
    ),
]


class FakeIdentifier:
    def __init__(self) -> None:
        self.ranking = Ranking(is_leaf=True, candidates=[("rhizophora_mucronata", 0.9)])
        self.calls = 0

    @property
    def configured(self) -> bool:
        return True

    async def identify(self, image_data_urls: list[str], options: list[SpeciesOption]) -> Ranking:
        self.calls += 1
        assert len(image_data_urls) == 2
        assert all(url.startswith("data:image/jpeg;base64,") for url in image_data_urls)
        return self.ranking


class FakeRepository:
    def __init__(self) -> None:
        self.species = list(SPECIES)
        self.uploaded: list[str] = []
        self.removed: list[str] = []
        self.rows: list[dict[str, Any]] = []
        self.fail_insert = False
        self.roles: dict[str, str] = {USER.id: "community", ADMIN.id: "admin"}

    def supported_species(self) -> list[SpeciesOption]:
        return self.species

    def upload_photo(self, path: str, data: bytes) -> None:
        self.uploaded.append(path)

    def remove_photo(self, path: str) -> None:
        self.removed.append(path)

    def insert_prediction(self, row: dict[str, Any]) -> dict[str, Any]:
        if self.fail_insert:
            raise RuntimeError("insert failed")
        stored = {"id": "cccccccc-cccc-cccc-cccc-cccccccccccc", **row}
        self.rows.append(stored)
        return stored

    def find_prediction(self, prediction_id: str, access_token: str) -> dict[str, Any] | None:
        return None

    def set_role(self, user_id: str, role: str) -> bool:
        if user_id not in self.roles:
            return False
        self.roles[user_id] = role
        return True


@pytest.fixture
def identifier() -> FakeIdentifier:
    return FakeIdentifier()


@pytest.fixture
def repository() -> FakeRepository:
    return FakeRepository()


@pytest.fixture
def make_client(identifier: FakeIdentifier, repository: FakeRepository):
    def build(user: CurrentUser | None = USER, raise_errors: bool = True) -> TestClient:
        app = create_app(get_settings())
        app.dependency_overrides[get_identifier] = lambda: identifier
        app.dependency_overrides[get_repository] = lambda: repository
        if user is not None:
            app.dependency_overrides[get_current_user] = lambda: user
        return TestClient(app, raise_server_exceptions=raise_errors)

    return build


@pytest.fixture
def leaf_jpeg() -> bytes:
    buffer = io.BytesIO()
    Image.new("RGB", (64, 48), (60, 120, 70)).save(buffer, format="JPEG")
    return buffer.getvalue()
