import time

import jwt
import pytest
from cryptography.hazmat.primitives.asymmetric import ec

from app.core import security
from app.core.config import get_settings
from app.core.errors import AppError
from tests.conftest import ADMIN, USER

PRIVATE_KEY = ec.generate_private_key(ec.SECP256R1())


class StaticJwks:
    def get_signing_key_from_jwt(self, _: str):
        return type("Key", (), {"key": PRIVATE_KEY.public_key()})()


@pytest.fixture(autouse=True)
def static_jwks(monkeypatch):
    monkeypatch.setattr(security, "_jwks", lambda: StaticJwks())


def make_token(**overrides) -> str:
    settings = get_settings()
    claims = {
        "sub": USER.id,
        "aud": settings.supabase_jwt_audience,
        "iss": settings.jwt_issuer,
        "exp": int(time.time()) + 300,
        "user_role": "coordinator",
        **overrides,
    }
    return jwt.encode(claims, PRIVATE_KEY, algorithm="ES256")


def test_valid_token_reads_role_claim():
    user = security.verify_token(make_token())
    assert user.id == USER.id
    assert user.role == "coordinator"


def test_unknown_role_falls_back_to_community():
    assert security.verify_token(make_token(user_role="superuser")).role == "community"


@pytest.mark.parametrize(
    "overrides",
    [{"exp": int(time.time()) - 10}, {"aud": "anon"}, {"iss": "https://evil.example/auth/v1"}],
)
def test_rejects_invalid_claims(overrides):
    with pytest.raises(AppError) as error:
        security.verify_token(make_token(**overrides))
    assert error.value.status == 401


def test_admin_route_requires_admin(make_client):
    with make_client(user=USER) as client:
        response = client.post(f"/v1/admin/users/{ADMIN.id}/role", json={"role": "community"})
    assert response.status_code == 403
    assert response.json()["error"]["code"] == "forbidden"


def test_admin_cannot_demote_self(make_client):
    with make_client(user=ADMIN) as client:
        response = client.post(f"/v1/admin/users/{ADMIN.id}/role", json={"role": "community"})
    assert response.status_code == 409
    assert response.json()["error"]["code"] == "cannot_demote_self"


def test_admin_changes_role(make_client, repository):
    with make_client(user=ADMIN) as client:
        response = client.post(f"/v1/admin/users/{USER.id}/role", json={"role": "coordinator"})
    assert response.status_code == 200
    assert repository.roles[USER.id] == "coordinator"
