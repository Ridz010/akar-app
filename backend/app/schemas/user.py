from uuid import UUID

from pydantic import BaseModel

from app.core.security import Role


class RoleUpdate(BaseModel):
    role: Role


class RoleOut(BaseModel):
    id: UUID
    role: Role
