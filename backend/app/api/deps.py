from collections.abc import Callable

from fastapi import Depends, Header, Request

from app.core.config import Settings, get_settings
from app.core.errors import AppError
from app.core.security import CurrentUser, Role, unauthenticated, verify_token
from app.services.identifier import Identifier
from app.services.repository import Repository, SupabaseRepository


def get_current_user(authorization: str | None = Header(default=None)) -> CurrentUser:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise unauthenticated()
    return verify_token(authorization.split(" ", 1)[1].strip())


def require_roles(*roles: Role) -> Callable[[CurrentUser], CurrentUser]:
    def dependency(user: CurrentUser = Depends(get_current_user)) -> CurrentUser:
        if user.role not in roles:
            raise AppError(403, "forbidden", "Kamu tidak memiliki akses untuk tindakan ini.")
        return user

    return dependency


def get_identifier(request: Request) -> Identifier:
    return request.app.state.identifier


def get_repository() -> Repository:
    return SupabaseRepository()


def settings_dependency() -> Settings:
    return get_settings()
