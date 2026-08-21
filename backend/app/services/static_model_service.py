"""
backend/app/services/static_model_service.py
=============================================
Service for the static 42-feature ANN classifier.
Completely independent from TensorFlowModelService (BiLSTM).
Produces the same application-level result contract.
"""

import os
import json
from typing import Optional, List
from app.services.model_service import ModelStatus, PredictionResult


class StaticModelService:
    """
    Loads and serves predictions from the static_v1 ANN model.

    Input: 42 floats (single-hand, wrist-relative, max-abs normalised, XY only)
    Output: PredictionResult with class label, confidence, probabilities
    """

    def __init__(self, model_dir: str):
        self.model = None
        self.model_dir = model_dir
        self.status = ModelStatus.WAITING
        self.label_map: dict = {}
        self.num_classes: int = 0
        self.model_version: str = "unknown"
        self.confidence_threshold: float = 0.60
        self._load_model()

    def _load_model(self):
        if not os.path.exists(self.model_dir):
            self.status = ModelStatus.WAITING
            return

        metadata_path = os.path.join(self.model_dir, "metadata.json")
        label_map_path = os.path.join(self.model_dir, "label_map.json")
        model_path = os.path.join(self.model_dir, "model.keras")

        if not os.path.exists(metadata_path) or not os.path.exists(model_path):
            self.status = ModelStatus.WAITING
            return

        try:
            self.status = ModelStatus.LOADING

            with open(metadata_path) as f:
                raw_meta = json.load(f)

            self.model_version = raw_meta.get("model_version", "static_v1")
            self.confidence_threshold = raw_meta.get("confidence_threshold", 0.60)
            self.num_classes = raw_meta.get("class_count", 0)

            if os.path.exists(label_map_path):
                with open(label_map_path) as f:
                    self.label_map = json.load(f)
            else:
                self.label_map = raw_meta.get("class_labels", {})

            import tensorflow as tf
            self.model = tf.keras.models.load_model(model_path, compile=False)
            self.status = ModelStatus.READY

        except Exception as e:
            self.status = ModelStatus.ERROR
            print(f"Failed to load static model: {e}")

    def get_status(self) -> ModelStatus:
        return self.status

    def is_loaded(self) -> bool:
        return self.status == ModelStatus.READY

    def get_version(self) -> Optional[str]:
        return self.model_version if self.is_loaded() else None

    def predict(self, features: List[float]) -> PredictionResult:
        """
        Run inference on a single 42-feature vector.

        Args:
            features: List of 42 floats representing wrist-relative,
                      max-abs normalised XY landmarks for one hand.

        Returns:
            PredictionResult with class label, confidence, probabilities.

        Raises:
            ModelNotReadyError: If model is not loaded.
            PredictionError: If inference fails.
        """
        from app.core.exceptions import ModelNotReadyError, PredictionError
        import numpy as np

        if not self.is_loaded():
            raise ModelNotReadyError("Static model is not loaded yet.")

        if len(features) != 42:
            raise PredictionError(
                f"Static model expects exactly 42 features, got {len(features)}."
            )

        try:
            input_data = np.array([features], dtype=np.float32)
            predictions = self.model.predict(input_data, verbose=0)[0]

            best_idx = int(np.argmax(predictions))
            confidence = float(predictions[best_idx])

            label = self.label_map.get(str(best_idx), f"class_{best_idx}")
            sign_id = label.lower().replace(" ", "_").replace("/", "_")

            return PredictionResult(
                class_index=best_idx,
                sign_id=sign_id,
                label=label,
                confidence=confidence,
                probabilities=predictions.tolist(),
            )
        except Exception as e:
            raise PredictionError(f"Static model inference failed: {e}")
