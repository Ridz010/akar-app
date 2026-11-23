from typing import Any, Protocol

from app.core.config import get_settings
from app.db.supabase import admin_client, user_client
from app.services.identifier import SpeciesOption

PREDICTION_COLUMNS = (
    "id, prediction_status, predicted_label, confidence, top_k, model_version, photo_path, "
    "observed_traits, photo_quality, photo_feedback, agreement, "
    "species(id, scientific_name, local_name, family, leaf_traits)"
)


class Repository(Protocol):
    def supported_species(self) -> list[SpeciesOption]: ...

    def upload_photo(self, path: str, data: bytes) -> None: ...

    def remove_photo(self, path: str) -> None: ...

    def insert_prediction(self, row: dict[str, Any]) -> dict[str, Any]: ...

    def find_prediction(self, prediction_id: str, access_token: str) -> dict[str, Any] | None: ...

    def set_role(self, user_id: str, role: str) -> bool: ...


class SupabaseRepository:
    def supported_species(self) -> list[SpeciesOption]:
        rows = (
            admin_client()
            .table("species")
            .select("id, model_label, scientific_name, local_name, leaf_traits, family")
            .eq("is_supported", True)
            .not_.is_("model_label", "null")
            .order("scientific_name")
            .execute()
            .data
        )
        return [SpeciesOption(**row) for row in rows]

    def upload_photo(self, path: str, data: bytes) -> None:
        admin_client().storage.from_(get_settings().storage_bucket).upload(
            path, data, {"content-type": "image/jpeg", "upsert": "false"}
        )

    def remove_photo(self, path: str) -> None:
        admin_client().storage.from_(get_settings().storage_bucket).remove([path])

    def insert_prediction(self, row: dict[str, Any]) -> dict[str, Any]:
        return admin_client().table("predictions").insert(row).execute().data[0]

    def find_prediction(self, prediction_id: str, access_token: str) -> dict[str, Any] | None:
        rows = (
            user_client(access_token)
            .table("predictions")
            .select(PREDICTION_COLUMNS)
            .eq("id", prediction_id)
            .limit(1)
            .execute()
            .data
        )
        return rows[0] if rows else None

    def set_role(self, user_id: str, role: str) -> bool:
        rows = (
            admin_client().table("profiles").update({"role": role}).eq("id", user_id).execute().data
        )
        return bool(rows)
