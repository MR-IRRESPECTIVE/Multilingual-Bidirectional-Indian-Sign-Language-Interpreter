import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.exceptions import ModelMetadataMismatchError

client = TestClient(app)

ENDPOINT = "/api/translate/sign"
STATUS_ENDPOINT = "/api/model/status"

def test_model_state_unavailable():
    response = client.get(STATUS_ENDPOINT)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["loaded"] is False
    assert data["status"] == "waiting_for_model"

    frames = [[0.5] * 86 for _ in range(30)]
    response = client.post(ENDPOINT, json={"frames": frames})
    assert response.status_code == 503
    assert response.json()["error"]["code"] == "MODEL_NOT_READY"

def test_model_state_loaded(monkeypatch):
    from app.api.endpoints import model_service
    monkeypatch.setattr(model_service, "_should_load", True)
    
    response = client.get(STATUS_ENDPOINT)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["loaded"] is True
    assert data["model_version"] == "mock-v1"
    assert data["feature_generation"] == "v2-86"
    assert len(data["classes"]) == 3
    assert data["status"] == "model_ready"

def test_prediction_above_threshold(monkeypatch):
    from app.api.endpoints import model_service, recognition_service
    monkeypatch.setattr(model_service, "_should_load", True)
    monkeypatch.setattr(model_service, "mock_prediction_label", "Hello")
    monkeypatch.setattr(model_service, "mock_prediction_confidence", 0.95)
    monkeypatch.setattr(recognition_service, "threshold", 0.70)
    
    frames = [[0.5] * 86 for _ in range(30)]
    response = client.post(ENDPOINT, json={"frames": frames})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["prediction"]["sign_id"] == "hello"
    assert data["prediction"]["label"] == "Hello"
    assert data["prediction"]["confidence"] == 0.95
    assert data["model"]["version"] == "mock-v1"

def test_prediction_below_threshold(monkeypatch):
    from app.api.endpoints import model_service, recognition_service
    monkeypatch.setattr(model_service, "_should_load", True)
    monkeypatch.setattr(model_service, "mock_prediction_label", "Hello")
    monkeypatch.setattr(model_service, "mock_prediction_confidence", 0.45)
    monkeypatch.setattr(recognition_service, "threshold", 0.70)
    
    frames = [[0.5] * 86 for _ in range(30)]
    response = client.post(ENDPOINT, json={"frames": frames})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["prediction"]["sign_id"] is None
    assert data["prediction"]["label"] == "Unknown"
    assert data["prediction"]["confidence"] == 0.45

def test_prediction_exactly_at_threshold(monkeypatch):
    from app.api.endpoints import model_service, recognition_service
    monkeypatch.setattr(model_service, "_should_load", True)
    monkeypatch.setattr(model_service, "mock_prediction_label", "Yes")
    monkeypatch.setattr(model_service, "mock_prediction_confidence", 0.70)
    monkeypatch.setattr(recognition_service, "threshold", 0.70)
    
    frames = [[0.5] * 86 for _ in range(30)]
    response = client.post(ENDPOINT, json={"frames": frames})
    assert response.status_code == 200
    data = response.json()
    assert data["prediction"]["sign_id"] == "yes"

def test_metadata_mismatch_exception_handling(monkeypatch):
    from app.api.endpoints import model_service
    
    def raise_mismatch(*args, **kwargs):
        raise ModelMetadataMismatchError("Expected v2-86")
        
    monkeypatch.setattr(model_service, "predict", raise_mismatch)
    monkeypatch.setattr(model_service, "is_loaded", lambda: True)
    
    frames = [[0.5] * 86 for _ in range(30)]
    response = client.post(ENDPOINT, json={"frames": frames})
    assert response.status_code == 500
    assert response.json()["error"]["code"] == "MODEL_METADATA_MISMATCH"
