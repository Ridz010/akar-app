from dataclasses import dataclass
from typing import Literal, cast

import jwt
from jwt import PyJWKClient

from app.core.config import get_settings
from app.core.errors import AppError

Role = Literal["community", "coordinator", "admin"]
ROLES: tuple[Role, ...] = ("community", "coordinator", "admin")


def unauthenticated() -> AppError:
    return AppError(401, "unauthenticated", "Sesi berakhir. Silakan masuk lagi.")


@dataclass(frozen=True)
class CurrentUser:
    id: str
    email: str | None
    role: Role
    token: str

    @property
    def is_verifier(self) -> bool:
        return self.role in ("coordinator", "admin")


_jwks_client: PyJWKClient | None = None


def _jwks() -> PyJWKClient:
    global _jwks_client
    if _jwks_client is None:
        _jwks_client = PyJWKClient(get_settings().jwks_url, cache_keys=True, lifespan=600)
    return _jwks_client


def decode_claims(token: str, key: object) -> dict:
    settings = get_settings()
    return jwt.decode(
        token,
        key,
        algorithms=["ES256", "RS256"],
        audience=settings.supabase_jwt_audience,
        issuer=settings.jwt_issuer,
    )


def user_from_claims(claims: dict, token: str) -> CurrentUser:
    role = claims.get("user_role")
    return CurrentUser(
        id=claims["sub"],
        email=claims.get("email"),
        role=cast(Role, role) if role in ROLES else "community",
        token=token,
    )


def verify_token(token: str) -> CurrentUser:
    try:
        key = _jwks().get_signing_key_from_jwt(token).key
        claims = decode_claims(token, key)
    except (jwt.PyJWTError, KeyError) as exc:
        raise unauthenticated() from exc
    return user_from_claims(claims, token)
