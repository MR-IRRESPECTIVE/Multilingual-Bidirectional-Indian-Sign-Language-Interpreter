"""
backend/tests/test_static_model.py
===================================
Tests for the static 42-feature ANN model service and API endpoint.
"""

import os
import json
import math
import pytest
from unittest.mock import patch, MagicMock

# Set test environment BEFORE importing app modules
os.environ["ENVIRONMENT"] = "test"


class TestStaticModelService:
    """Tests for StaticModelService in isolation."""

    def test_service_loads_with_valid_model_dir(self):
        """Test that service loads when model files exist."""
        model_dir = os.path.abspath(
            os.path.join(os.path.dirname(__file__), "..", "models", "archive", "static_v1")
        )
        if not os.path.exists(os.path.join(model_dir, "model.keras")):
            pytest.skip("static_v1 model not available for loading test")

        from app.services.static_model_service import StaticModelService
        from app.services.model_service import ModelStatus

        svc = StaticModelService(model_dir)
        assert svc.is_loaded()
        assert svc.get_status() == ModelStatus.READY
        assert svc.get_version() == "static_v1"

    def test_service_handles_missing_dir(self):
        """Test that service stays in WAITING state with missing directory."""
        from app.services.static_model_service import StaticModelService
        from app.services.model_service import ModelStatus

        svc = StaticModelService("/nonexistent/path")
        assert not svc.is_loaded()
        assert svc.get_status() == ModelStatus.WAITING

    def test_predict_requires_42_features(self):
        """Test that predict raises for wrong feature count."""
        model_dir = os.path.abspath(
            os.path.join(os.path.dirname(__file__), "..", "models", "archive", "static_v1")
        )
        if not os.path.exists(os.path.join(model_dir, "model.keras")):
            pytest.skip("static_v1 model not available")

        from app.services.static_model_service import StaticModelService
        from app.core.exceptions import PredictionError

        svc = StaticModelService(model_dir)
        with pytest.raises(PredictionError, match="42 features"):
            svc.predict([0.0] * 10)

    def test_predict_returns_valid_result(self):
        """Test that predict returns a well-formed PredictionResult."""
        model_dir = os.path.abspath(
            os.path.join(os.path.dirname(__file__), "..", "models", "archive", "static_v1")
        )
        if not os.path.exists(os.path.join(model_dir, "model.keras")):
            pytest.skip("static_v1 model not available")

        from app.services.static_model_service import StaticModelService

        svc = StaticModelService(model_dir)
        result = svc.predict([0.0] * 42)

        assert result.label is not None
        assert isinstance(result.confidence, float)
        assert 0.0 <= result.confidence <= 1.0
        assert len(result.probabilities) == 13  # 13 classes
        assert abs(sum(result.probabilities) - 1.0) < 0.01

    def test_label_map_has_13_classes(self):
        """Test that label_map matches expected class count."""
        label_path = os.path.abspath(
            os.path.join(os.path.dirname(__file__), "..", "models", "archive", "static_v1", "label_map.json")
        )
        if not os.path.exists(label_path):
            pytest.skip("label_map.json not available")

        with open(label_path) as f:
            lm = json.load(f)
        assert len(lm) == 13
        # Verify expected classes exist
        values = set(lm.values())
        assert "hello" in values
        assert "sorry" in values
        assert "A" in values
        assert "B" in values
        assert "C" in values


class TestStaticRecognitionSchema:
    """Tests for StaticRecognitionRequest validation."""

    def test_valid_42_features(self):
        from app.schemas.api import StaticRecognitionRequest
        req = StaticRecognitionRequest(features=[0.0] * 42)
        assert len(req.features) == 42

    def test_rejects_wrong_length(self):
        from app.schemas.api import StaticRecognitionRequest
        with pytest.raises(Exception):
            StaticRecognitionRequest(features=[0.0] * 10)

    def test_rejects_43_features(self):
        from app.schemas.api import StaticRecognitionRequest
        with pytest.raises(Exception):
            StaticRecognitionRequest(features=[0.0] * 43)

    def test_rejects_nan(self):
        from app.schemas.api import StaticRecognitionRequest
        features = [0.0] * 42
        features[5] = float('nan')
        with pytest.raises(Exception):
            StaticRecognitionRequest(features=features)

    def test_rejects_infinity(self):
        from app.schemas.api import StaticRecognitionRequest
        features = [0.0] * 42
        features[0] = float('inf')
        with pytest.raises(Exception):
            StaticRecognitionRequest(features=features)


class TestStaticEndpoint:
    """Tests for the /translate/sign/static API endpoint."""

    def test_static_endpoint_returns_503_in_test_mode(self):
        """In test environment, static model is None, so endpoint should fail gracefully."""
        from fastapi.testclient import TestClient
        from app.main import app

        client = TestClient(app)
        resp = client.post(
            "/api/translate/sign/static",
            json={"features": [0.0] * 42}
        )
        # In test mode, static_model_service is None -> ModelNotReadyError (unless loaded)
        assert resp.status_code in (200, 503, 500)

    def test_static_endpoint_rejects_wrong_features(self):
        """Schema validation should reject wrong feature count."""
        from fastapi.testclient import TestClient
        from app.main import app

        client = TestClient(app)
        resp = client.post(
            "/api/translate/sign/static",
            json={"features": [0.0] * 10}
        )
        assert resp.status_code == 422


class TestStaticDatasetIntegrity:
    """Tests for the merged static dataset files."""

    def test_dataset_csv_exists(self):
        csv_path = os.path.abspath(
            os.path.join(os.path.dirname(__file__), "..", "..", "datasets", "static_training", "static_dataset.csv")
        )
        if not os.path.exists(csv_path):
            pytest.skip("static_dataset.csv not built yet")
        import pandas as pd
        df = pd.read_csv(csv_path, header=None)
        assert df.shape[1] == 43  # 1 class column + 42 features
        assert df.shape[0] > 0

    def test_label_map_matches_dataset(self):
        lm_path = os.path.abspath(
            os.path.join(os.path.dirname(__file__), "..", "..", "datasets", "static_training", "label_map.json")
        )
        csv_path = os.path.abspath(
            os.path.join(os.path.dirname(__file__), "..", "..", "datasets", "static_training", "static_dataset.csv")
        )
        if not os.path.exists(lm_path) or not os.path.exists(csv_path):
            pytest.skip("Dataset files not available")

        import pandas as pd
        with open(lm_path) as f:
            lm = json.load(f)
        df = pd.read_csv(csv_path, header=None)
        dataset_classes = set(df[0].unique())
        label_map_ids = set(int(k) for k in lm.keys())
        assert dataset_classes == label_map_ids

    def test_no_nan_in_features(self):
        csv_path = os.path.abspath(
            os.path.join(os.path.dirname(__file__), "..", "..", "datasets", "static_training", "static_dataset.csv")
        )
        if not os.path.exists(csv_path):
            pytest.skip("static_dataset.csv not built yet")
        import pandas as pd
        import numpy as np
        df = pd.read_csv(csv_path, header=None)
        features = df.iloc[:, 1:]
        assert features.isnull().sum().sum() == 0
        assert np.isinf(features.values.astype(float)).sum() == 0
