from fastapi.testclient import TestClient

import math
import pytest

from app.main import app
from app.core.exceptions import ModelNotReadyError, PredictionError

client = TestClient(app, raise_server_exceptions=False)

def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["status"] == "healthy"

def test_readiness():
    response = client.get("/api/ready")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is False
    assert data["status"] == "not_ready"

def test_model_status():
    response = client.get("/api/model/status")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["loaded"] is False
    assert data["status"] == "waiting_for_model"

def test_valid_translation_request(monkeypatch):
    from app.api.endpoints import model_service
    # Force the mock model to be "loaded" so it answers predictions
    monkeypatch.setattr(model_service, "_should_load", True)
    
    frames = [[0.5] * 86 for _ in range(29)]
    response = client.post("/api/translate/sign", json={"frames": frames})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["prediction"]["label"] == "MOCK_SIGN"
    assert data["model"]["version"] == "mock-v1"

def test_invalid_frame_count_under():
    frames = [[0.5] * 86 for _ in range(28)]
    response = client.post("/api/translate/sign", json={"frames": frames})
    assert response.status_code == 422
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "INVALID_FRAME_SHAPE"

def test_invalid_frame_count_over():
    frames = [[0.5] * 86 for _ in range(30)]
    response = client.post("/api/translate/sign", json={"frames": frames})
    assert response.status_code == 422
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "INVALID_FRAME_SHAPE"

def test_invalid_feature_dimension_under():
    frames = [[0.5] * 85 for _ in range(29)]
    response = client.post("/api/translate/sign", json={"frames": frames})
    assert response.status_code == 422
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "INVALID_FEATURE_DIMENSION"

def test_invalid_feature_dimension_over():
    frames = [[0.5] * 87 for _ in range(29)]
    response = client.post("/api/translate/sign", json={"frames": frames})
    assert response.status_code == 422
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "INVALID_FEATURE_DIMENSION"

def test_nan_values():
    frames = [[0.5] * 86 for _ in range(29)]
    frames[5][10] = None # Simulating what JS stringifies NaN to (null)
    response = client.post("/api/translate/sign", json={"frames": frames})
    assert response.status_code == 422
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "NON_FINITE_FEATURES"

def test_infinity_values():
    frames = [[0.5] * 86 for _ in range(29)]
    frames[5][10] = "Infinity" 
    response = client.post("/api/translate/sign", json={"frames": frames})
    assert response.status_code == 422
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "NON_FINITE_FEATURES"

def test_malformed_request():
    response = client.post("/api/translate/sign", json={"bad_payload": "yes"})
    assert response.status_code == 422
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "INVALID_INPUT"

def test_history(monkeypatch):
    from app.api.endpoints import model_service
    monkeypatch.setattr(model_service, "_should_load", True)
    
    frames = [[0.5] * 86 for _ in range(29)]
    client.post("/api/translate/sign", json={"frames": frames})
    
    response = client.get("/api/history")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert len(data["history"]) >= 1
    assert data["history"][-1]["prediction"] == "MOCK_SIGN"
    assert data["history"][-1]["model_version"] == "mock-v1"

    # Phase 8: History API Hardening
    assert "direction" in data["history"][-1]

def test_model_not_ready():
    # By default MockModelService is NOT loaded
    frames = [[0.5] * 86 for _ in range(29)]
    response = client.post("/api/translate/sign", json={"frames": frames})
    assert response.status_code == 503
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "MODEL_NOT_READY"

def test_prediction_error(monkeypatch):
    from app.api.endpoints import model_service
    def mock_predict(*args, **kwargs):
        raise PredictionError("Inference failed")
    monkeypatch.setattr(model_service, "predict", mock_predict)
    monkeypatch.setattr(model_service, "is_loaded", lambda: True)
    
    frames = [[0.5] * 86 for _ in range(29)]
    response = client.post("/api/translate/sign", json={"frames": frames})
    assert response.status_code == 500
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "PREDICTION_ERROR"

def test_internal_server_error(monkeypatch):
    from app.api.endpoints import model_service
    def mock_predict(*args, **kwargs):
        raise Exception("Random DB connection crash")
    monkeypatch.setattr(model_service, "predict", mock_predict)
    monkeypatch.setattr(model_service, "is_loaded", lambda: True)
    
    frames = [[0.5] * 86 for _ in range(29)]
    response = client.post("/api/translate/sign", json={"frames": frames})
    assert response.status_code == 500
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "INTERNAL_ERROR"
    assert "internal server error" in data["error"]["message"].lower()