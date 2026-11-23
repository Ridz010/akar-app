from uuid import UUID

from fastapi import APIRouter, Depends

from app.api.deps import get_repository, require_roles
from app.core.security import CurrentUser
from app.schemas.user import RoleOut, RoleUpdate
from app.services import users as service
from app.services.repository import Repository

router = APIRouter(prefix="/admin", tags=["admin"])


@router.post("/users/{user_id}/role", response_model=RoleOut)
async def change_user_role(
    user_id: UUID,
    body: RoleUpdate,
    actor: CurrentUser = Depends(require_roles("admin")),
    repository: Repository = Depends(get_repository),
) -> RoleOut:
    return await service.change_role(str(user_id), body.role, actor, repository=repository)
