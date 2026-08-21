from fastapi.testclient import TestClient
import os
os.environ["ENVIRONMENT"] = "test"
from app.main import app
import numpy as np

client = TestClient(app, raise_server_exceptions=False)

def test_live_inference_accepted_shapes(monkeypatch):
    from app.api.endpoints import model_service
    monkeypatch.setattr(model_service, "_should_load", True)
    
    # Test 30x86
    frames = np.random.rand(30, 86).tolist()
    response = client.post("/api/translate/sign", json={"frames": frames})
    assert response.status_code == 200, "30x86 must be accepted"
    
    # Test 15x86
    frames = np.random.rand(15, 86).tolist()
    response = client.post("/api/translate/sign", json={"frames": frames})
    assert response.status_code == 200, "15x86 must be accepted"

    # Test 29x86
    frames = np.random.rand(29, 86).tolist()
    response = client.post("/api/translate/sign", json={"frames": frames})
    assert response.status_code == 200, "29x86 must be accepted"

def test_live_inference_rejected_shapes():
    # 31x86 - Over length
    frames = [[0.0]*86 for _ in range(31)]
    resp = client.post("/api/translate/sign", json={"frames": frames})
    assert resp.status_code == 422
    
    # 30x85 - Invalid dimension
    frames = [[0.0]*85 for _ in range(30)]
    resp = client.post("/api/translate/sign", json={"frames": frames})
    assert resp.status_code == 422
    
    # NaN
    frames = [[0.0]*86 for _ in range(30)]
    frames[0][0] = None
    resp = client.post("/api/translate/sign", json={"frames": frames})
    assert resp.status_code == 422

    # Infinity
    frames[0][0] = "Infinity"
    resp = client.post("/api/translate/sign", json={"frames": frames})
    assert resp.status_code == 422
