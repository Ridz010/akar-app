from starlette.concurrency import run_in_threadpool

from app.core.errors import AppError
from app.core.security import CurrentUser, Role
from app.schemas.user import RoleOut
from app.services.repository import Repository


async def change_role(
    user_id: str, role: Role, actor: CurrentUser, *, repository: Repository
) -> RoleOut:
    if user_id == actor.id and role != "admin":
        raise AppError(409, "cannot_demote_self", "Admin tidak dapat menurunkan perannya sendiri.")
    updated = await run_in_threadpool(repository.set_role, user_id, role)
    if not updated:
        raise AppError(404, "not_found", "Pengguna tidak ditemukan.")
    return RoleOut(id=user_id, role=role)
