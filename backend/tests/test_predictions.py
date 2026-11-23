from app.services.identifier import Ranking


def post_image(client, data: bytes, content_type: str = "image/jpeg"):
    return client.post("/v1/predictions", files={"image": ("leaf.jpg", data, content_type)})


def test_health(make_client):
    with make_client() as client:
        response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["model_version"] == "openrouter/openai/gpt-4o-mini"


def test_requires_bearer_token(make_client, leaf_jpeg):
    with make_client(user=None) as client:
        response = post_image(client, leaf_jpeg)
    assert response.status_code == 401
    assert response.json()["error"]["code"] == "unauthenticated"


def test_confident_prediction_is_recorded(make_client, repository, leaf_jpeg):
    with make_client() as client:
        response = post_image(client, leaf_jpeg)

    assert response.status_code == 201
    body = response.json()
    assert body["prediction_status"] == "confident"
    assert body["predicted_label"] == "rhizophora_mucronata"
    assert body["species"]["scientific_name"] == "Rhizophora mucronata"
    assert body["top_k"] == [
        {"label": "Rhizophora mucronata", "local_name": "Bakau hitam", "confidence": 0.9}
    ]
    assert body["species"]["family"] == "Rhizophoraceae"
    assert body["agreement"] == 1.0
    assert body["photo_path"].startswith("11111111-1111-1111-1111-111111111111/")
    assert repository.uploaded == [body["photo_path"]]
    assert repository.rows[0]["species_id"] == "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"


def test_mid_confidence_needs_review(make_client, identifier, leaf_jpeg):
    identifier.ranking = Ranking(is_leaf=True, candidates=[("avicennia_marina", 0.6)])
    with make_client() as client:
        body = post_image(client, leaf_jpeg).json()
    assert body["prediction_status"] == "needs_review"
    assert body["species"]["local_name"] == "Api-api putih"


def test_not_a_leaf_is_unrecognized(make_client, identifier, leaf_jpeg):
    identifier.ranking = Ranking(is_leaf=False, candidates=[])
    with make_client() as client:
        body = post_image(client, leaf_jpeg).json()
    assert body["prediction_status"] == "unrecognized"
    assert body["species"] is None
    assert body["predicted_label"] is None
    assert body["confidence"] == 0


def test_rejects_non_image(make_client, identifier):
    with make_client() as client:
        response = post_image(client, b"bukan gambar", "text/plain")
    assert response.status_code == 400
    assert response.json()["error"]["code"] == "invalid_image"
    assert identifier.calls == 0


def test_rejects_large_upload(make_client, leaf_jpeg, monkeypatch):
    from app.core.config import get_settings

    monkeypatch.setattr(get_settings(), "max_upload_bytes", 10)
    with make_client() as client:
        response = post_image(client, leaf_jpeg)
    assert response.status_code == 413
    assert response.json()["error"]["code"] == "image_too_large"


def test_empty_catalog_returns_503(make_client, repository, identifier, leaf_jpeg):
    repository.species = []
    with make_client() as client:
        response = post_image(client, leaf_jpeg)
    assert response.status_code == 503
    assert response.json()["error"]["code"] == "species_catalog_empty"
    assert identifier.calls == 0


def test_photo_removed_when_insert_fails(make_client, repository, leaf_jpeg):
    repository.fail_insert = True
    with make_client(raise_errors=False) as client:
        response = post_image(client, leaf_jpeg)
    assert response.status_code == 500
    assert response.json()["error"]["code"] == "internal_error"
    assert repository.removed == repository.uploaded


def test_unknown_prediction_returns_404(make_client):
    with make_client() as client:
        response = client.get("/v1/predictions/cccccccc-cccc-cccc-cccc-cccccccccccc")
    assert response.status_code == 404
    assert response.json()["error"]["code"] == "not_found"


def test_poor_photo_cannot_be_confident(make_client, identifier, leaf_jpeg):
    identifier.ranking = Ranking(
        is_leaf=True,
        candidates=[("rhizophora_mucronata", 0.95)],
        photo_quality="poor",
        photo_feedback="Dekatkan kamera ke satu daun.",
    )
    with make_client() as client:
        body = post_image(client, leaf_jpeg).json()
    assert body["prediction_status"] == "needs_review"
    assert body["photo_feedback"] == "Dekatkan kamera ke satu daun."


def test_low_agreement_cannot_be_confident(make_client, identifier, repository, leaf_jpeg):
    identifier.ranking = Ranking(
        is_leaf=True,
        candidates=[("rhizophora_mucronata", 0.85)],
        observed_traits=["Ujung daun berduri kecil"],
        agreement=1 / 3,
    )
    with make_client() as client:
        body = post_image(client, leaf_jpeg).json()
    assert body["prediction_status"] == "needs_review"
    assert body["observed_traits"] == ["Ujung daun berduri kecil"]
    assert repository.rows[0]["observed_traits"] == ["Ujung daun berduri kecil"]


def test_root_lists_service_links(make_client):
    with make_client() as client:
        body = client.get("/").json()
    assert body["status"] == "ok"
    assert body["health"] == "/health"


def test_missing_env_reports_names_instead_of_crashing():
    from fastapi.testclient import TestClient

    from app.main import create_misconfigured_app

    client = TestClient(create_misconfigured_app(["SUPABASE_URL", "SUPABASE_SECRET_KEY"]))
    health = client.get("/health")
    assert health.status_code == 503
    assert health.json()["missing_env"] == ["SUPABASE_URL", "SUPABASE_SECRET_KEY"]
    scan = client.post("/v1/predictions")
    assert scan.status_code == 503
    assert scan.json()["error"]["code"] == "misconfigured"
