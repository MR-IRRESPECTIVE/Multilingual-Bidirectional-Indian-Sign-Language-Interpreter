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
    # Mock model intentionally returns False for is_loaded
    assert data["success"] is False
    assert data["status"] == "not_ready"

def test_model_status():
    response = client.get("/api/model/status")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["model_loaded"] is False
    assert data["status"] == "waiting_for_model"

def test_valid_translation_request():
    frames = [[0.5] * 86 for _ in range(30)]
    response = client.post("/api/translate/sign", json={"frames": frames})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["prediction"]["label"] == "MOCK_SIGN"
    assert data["status"] == "mock_prediction"

def test_invalid_frame_count_under():
    # 29 frames
    frames = [[0.5] * 86 for _ in range(29)]
    response = client.post("/api/translate/sign", json={"frames": frames})
    assert response.status_code == 422
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "INVALID_FRAME_DIMENSION"

def test_invalid_frame_count_over():
    # 31 frames
    frames = [[0.5] * 86 for _ in range(31)]
    response = client.post("/api/translate/sign", json={"frames": frames})
    assert response.status_code == 422
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "INVALID_FRAME_DIMENSION"

def test_invalid_feature_dimension_under():
    # 85 features
    frames = [[0.5] * 85 for _ in range(30)]
    response = client.post("/api/translate/sign", json={"frames": frames})
    assert response.status_code == 422
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "INVALID_FRAME_DIMENSION"

def test_invalid_feature_dimension_over():
    # 87 features
    frames = [[0.5] * 87 for _ in range(30)]
    response = client.post("/api/translate/sign", json={"frames": frames})
    assert response.status_code == 422
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "INVALID_FRAME_DIMENSION"

def test_nan_values():
    frames = [[0.5] * 86 for _ in range(30)]
    frames[5][10] = None # Simulating what JS stringifies NaN to (null)
    response = client.post("/api/translate/sign", json={"frames": frames})
    assert response.status_code == 422
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "INVALID_INPUT"

def test_infinity_values():
    frames = [[0.5] * 86 for _ in range(30)]
    # In python json, Infinity is valid, but our pydantic rejects it. Let's send a string "Infinity"
    # or just rely on the validation failing because it expects a number.
    frames[5][10] = "Infinity" 
    response = client.post("/api/translate/sign", json={"frames": frames})
    assert response.status_code == 422
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "INVALID_INPUT"

def test_malformed_request():
    response = client.post("/api/translate/sign", json={"bad_payload": "yes"})
    assert response.status_code == 422
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "INVALID_INPUT"

def test_history():
    # Insert a valid run
    frames = [[0.5] * 86 for _ in range(30)]
    client.post("/api/translate/sign", json={"frames": frames})
    
    response = client.get("/api/history")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert len(data["history"]) >= 1
    assert data["history"][-1]["prediction"] == "MOCK_SIGN"

# Monkey patching tests for internal errors
def test_model_not_ready(monkeypatch):
    from app.api.endpoints import model_service
    def mock_predict(*args, **kwargs):
        raise ModelNotReadyError("Model not loaded yet")
    monkeypatch.setattr(model_service, "predict", mock_predict)
    
    frames = [[0.5] * 86 for _ in range(30)]
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
    
    frames = [[0.5] * 86 for _ in range(30)]
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
    
    frames = [[0.5] * 86 for _ in range(30)]
    response = client.post("/api/translate/sign", json={"frames": frames})
    assert response.status_code == 500
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "INTERNAL_SERVER_ERROR"
    assert "internal server error" in data["error"]["message"].lower()
