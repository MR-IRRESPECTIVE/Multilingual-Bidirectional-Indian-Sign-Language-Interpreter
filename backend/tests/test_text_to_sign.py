import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

ENDPOINT = "/api/translate/text-to-sign"

def test_single_word_hello():
    """POST {"text": "hello"} → 200, success=True, signs contains hello sign with correct id/label/video_url"""
    response = client.post(ENDPOINT, json={"text": "hello"})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert len(data["signs"]) == 1
    assert data["signs"][0]["id"] == "hello"
    assert data["signs"][0]["label"] == "Hello"
    assert data["signs"][0]["video_url"] == "/signs/hello.mp4"

def test_case_insensitive():
    """POST {"text": "HELLO"} → same hello sign"""
    response = client.post(ENDPOINT, json={"text": "HELLO"})
    assert response.status_code == 200
    data = response.json()
    assert data["signs"][0]["id"] == "hello"

def test_whitespace_trimming():
    """POST {"text": " hello "} → same hello sign"""
    response = client.post(ENDPOINT, json={"text": " hello "})
    assert response.status_code == 200
    data = response.json()
    assert data["signs"][0]["id"] == "hello"

def test_punctuation_stripping():
    """POST {"text": "hello!"} → same hello sign"""
    response = client.post(ENDPOINT, json={"text": "hello!"})
    assert response.status_code == 200
    data = response.json()
    assert data["signs"][0]["id"] == "hello"

def test_multi_word_with_known_signs():
    """POST {"text": "hello good"} → two signs in order"""
    response = client.post(ENDPOINT, json={"text": "hello good"})
    assert response.status_code == 200
    data = response.json()
    assert len(data["signs"]) == 2
    assert data["signs"][0]["id"] == "hello"
    assert data["signs"][1]["id"] == "good"

def test_alias_resolution():
    """POST {"text": "hi"} → resolves to hello sign"""
    response = client.post(ENDPOINT, json={"text": "hi"})
    assert response.status_code == 200
    data = response.json()
    assert data["signs"][0]["id"] == "hello"

def test_food_alias():
    """POST {"text": "food"} → resolves to eat_food sign"""
    response = client.post(ENDPOINT, json={"text": "food"})
    assert response.status_code == 200
    data = response.json()
    assert data["signs"][0]["id"] == "eat_food"

def test_empty_input():
    """POST {"text": ""} → 422"""
    response = client.post(ENDPOINT, json={"text": ""})
    assert response.status_code == 422

def test_whitespace_only_input():
    """POST {"text": "   "} → 422"""
    response = client.post(ENDPOINT, json={"text": "   "})
    assert response.status_code == 422

def test_unsupported_word_partial_result():
    """POST {"text": "hello xyzunknown"} → 200, signs=[hello], unsupported_words=["xyzunknown"]"""
    response = client.post(ENDPOINT, json={"text": "hello xyzunknown"})
    assert response.status_code == 200
    data = response.json()
    assert len(data["signs"]) == 1
    assert data["signs"][0]["id"] == "hello"
    assert "xyzunknown" in data["unsupported_words"]

def test_all_unsupported():
    """POST {"text": "xyzunknown"} → 200, success=True, signs=[], unsupported_words=["xyzunknown"]"""
    response = client.post(ENDPOINT, json={"text": "xyzunknown"})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert len(data["signs"]) == 0
    assert "xyzunknown" in data["unsupported_words"]

def test_mixed_case():
    """POST {"text": "HeLLo"} → hello sign"""
    response = client.post(ENDPOINT, json={"text": "HeLLo"})
    assert response.status_code == 200
    data = response.json()
    assert data["signs"][0]["id"] == "hello"

def test_multiple_spaces():
    """POST {"text": "hello   good"} → two signs"""
    response = client.post(ENDPOINT, json={"text": "hello   good"})
    assert response.status_code == 200
    data = response.json()
    assert len(data["signs"]) == 2

def test_response_schema_fields():
    """verify all required fields present in response"""
    response = client.post(ENDPOINT, json={"text": "hello"})
    assert response.status_code == 200
    data = response.json()
    assert "success" in data
    assert "input_text" in data
    assert "normalized_text" in data
    assert "gloss" in data
    assert "signs" in data
    assert "unsupported_words" in data

def test_video_url_format():
    """verify video URLs follow /signs/<id>.mp4 pattern"""
    response = client.post(ENDPOINT, json={"text": "hello"})
    assert response.status_code == 200
    data = response.json()
    assert data["signs"][0]["video_url"] == "/signs/hello.mp4"

def test_multi_word_skip_unknown():
    """POST {"text": "I want to eat"} → signs=[eat_food], unsupported_words=["i", "want", "to"]"""
    response = client.post(ENDPOINT, json={"text": "I want to eat"})
    assert response.status_code == 200
    data = response.json()
    assert len(data["signs"]) == 1
    assert data["signs"][0]["id"] == "eat_food"
    assert data["unsupported_words"] == ["i", "want", "to"]

def test_gloss_matches_signs():
    """verify gloss list matches signs list"""
    response = client.post(ENDPOINT, json={"text": "hello good"})
    assert response.status_code == 200
    data = response.json()
    assert len(data["gloss"]) == 2
    assert data["gloss"][0] == "HELLO"
    assert data["gloss"][1] == "GOOD"

def test_existing_health_still_works():
    """GET /api/health still returns 200 (regression guard)"""
    response = client.get("/api/health")
    assert response.status_code == 200

def test_existing_translate_sign_still_works():
    """Regression: existing sign-to-text endpoint correctly enforces model readiness."""
    valid_frames = [[0.0] * 86 for _ in range(29)]
    response = client.post("/api/translate/sign", json={"frames": valid_frames})
    assert response.status_code == 503
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "MODEL_NOT_READY"
