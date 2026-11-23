from functools import lru_cache

from supabase import Client, create_client

from app.core.config import get_settings


@lru_cache
def admin_client() -> Client:
    settings = get_settings()
    return create_client(settings.supabase_url, settings.supabase_secret_key)


def user_client(access_token: str) -> Client:
    settings = get_settings()
    client = create_client(settings.supabase_url, settings.supabase_publishable_key)
    client.postgrest.auth(access_token)
    return client
