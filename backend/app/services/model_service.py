from abc import ABC, abstractmethod
from typing import List, Tuple, Optional, Dict, Any
from enum import Enum
from dataclasses import dataclass
import os
import json

class ModelStatus(str, Enum):
    WAITING = "waiting_for_model"
    LOADING = "model_loading"
    READY = "model_ready"
    ERROR = "model_error"

@dataclass
class ModelMetadata:
    model_version: str
    feature_generation: str
    feature_dimension: int
    frame_count: int
    classes: List[Dict[str, str]]  # Expected format: [{"id": "hello", "label": "Hello"}]
    framework: str

@dataclass
class PredictionResult:
    class_index: int
    sign_id: str
    label: str
    confidence: float
    probabilities: List[float]

class ModelService(ABC):
    @abstractmethod
    def get_status(self) -> ModelStatus:
        pass

    @abstractmethod
    def is_loaded(self) -> bool:
        pass

    @abstractmethod
    def get_version(self) -> str | None:
        pass

    @abstractmethod
    def get_metadata(self) -> Optional[ModelMetadata]:
        pass

    @abstractmethod
    def predict(self, frames: List[List[float]]) -> PredictionResult:
        """
        Takes 30x86 frames and returns a PredictionResult.
        Throws ModelNotReadyError if not loaded.
        Throws PredictionError if inference fails.
        """
        pass

class MockModelService(ModelService):
    def __init__(self, should_load: bool = False):
        self._version = "mock-v1"
        self._should_load = should_load
        
        self._metadata = ModelMetadata(
            model_version=self._version,
            feature_generation="v2-86",
            feature_dimension=86,
            frame_count=30,
            classes=[
                {"id": "mock_sign", "label": "MOCK_SIGN"},
                {"id": "hello", "label": "Hello"},
                {"id": "yes", "label": "Yes"}
            ],
            framework="mock"
        )
        
        # Test hook to force predictions
        self.mock_prediction_label = "MOCK_SIGN"
        self.mock_prediction_confidence = 0.95

    def get_status(self) -> ModelStatus:
        return ModelStatus.READY if self._should_load else ModelStatus.WAITING

    def is_loaded(self) -> bool:
        return self._should_load

    def get_version(self) -> str | None:
        return self._version
        
    def get_metadata(self) -> Optional[ModelMetadata]:
        return self._metadata if self._should_load else None

    def predict(self, frames: List[List[float]]) -> PredictionResult:
        from app.core.exceptions import ModelNotReadyError
        if not self._should_load:
            raise ModelNotReadyError("Model not loaded yet")
            
        sign_id = self.mock_prediction_label.lower()
        return PredictionResult(
            class_index=0,
            sign_id=sign_id,
            label=self.mock_prediction_label,
            confidence=self.mock_prediction_confidence,
            probabilities=[self.mock_prediction_confidence]
        )

class TensorFlowModelService(ModelService):
    def __init__(self, model_dir: str):
        self.model = None
        self.metadata: Optional[ModelMetadata] = None
        self.model_dir = model_dir
        self.status = ModelStatus.WAITING
        self._raw_class_map = {}
        self._load_model()

    def _load_model(self):
        from app.core.exceptions import ModelMetadataMismatchError
        
        if not os.path.exists(self.model_dir):
            self.status = ModelStatus.WAITING
            return
            
        metadata_path = os.path.join(self.model_dir, "metadata.json")
        if not os.path.exists(metadata_path):
            self.status = ModelStatus.WAITING
            return
            
        try:
            self.status = ModelStatus.LOADING
            
            with open(metadata_path, "r") as f:
                raw_meta = json.load(f)
                
            # Validate essential v2-86 rules before even trying to load TF
            feature_generation = raw_meta.get("feature_generation", "unknown")
            if feature_generation != "v2-86":
                raise ModelMetadataMismatchError(f"Expected feature_generation 'v2-86', got '{feature_generation}'")
                
            input_shape = raw_meta.get("input_shape", [])
            if len(input_shape) >= 2:
                # Handle varying shapes like [None, 30, 86] or [30, 86]
                frame_count = input_shape[-2]
                feature_dim = input_shape[-1]
                if frame_count != 30 or feature_dim != 86:
                    raise ModelMetadataMismatchError(f"Expected shape [..., 30, 86], got {input_shape}")
            else:
                frame_count = 30
                feature_dim = 86
                
            # Handle legacy class map vs structured list
            raw_classes = raw_meta.get("classes", {})
            structured_classes = []
            
            if isinstance(raw_classes, dict):
                self._raw_class_map = raw_classes
                for idx_str, label in sorted(raw_classes.items(), key=lambda x: int(x[0])):
                    # Very simple id generation for MVP compatibility
                    s_id = label.lower().replace(" ", "_").replace("/", "").replace("__", "_").strip("_")
                    structured_classes.append({"id": s_id, "label": label})
            elif isinstance(raw_classes, list):
                structured_classes = raw_classes
                for idx, c in enumerate(raw_classes):
                    self._raw_class_map[str(idx)] = c.get("label", "Unknown")
            
            self.metadata = ModelMetadata(
                model_version=raw_meta.get("model_version", "unknown-v1"),
                feature_generation="v2-86",
                feature_dimension=feature_dim,
                frame_count=frame_count,
                classes=structured_classes,
                framework=raw_meta.get("framework", "tensorflow")
            )
                
            # Lazy load TF
            import tensorflow as tf
            # Ensure it works cross-platform (SavedModel or keras)
            model_path = os.path.join(self.model_dir, "model.keras")
            if not os.path.exists(model_path):
                # Fallback to dir if it's a SavedModel format
                model_path = self.model_dir
                
            self.model = tf.keras.models.load_model(model_path, compile=False)
            self.status = ModelStatus.READY
            
        except ModelMetadataMismatchError as e:
            self.status = ModelStatus.ERROR
            print(f"Model validation failed: {e}")
            raise
        except Exception as e:
            self.status = ModelStatus.ERROR
            print(f"Failed to load TensorFlow model: {e}")

    def get_status(self) -> ModelStatus:
        return self.status

    def is_loaded(self) -> bool:
        return self.status == ModelStatus.READY

    def get_version(self) -> str | None:
        if self.metadata:
            return self.metadata.model_version
        return None
        
    def get_metadata(self) -> Optional[ModelMetadata]:
        return self.metadata

    def predict(self, frames: List[List[float]]) -> PredictionResult:
        from app.core.exceptions import ModelNotReadyError, PredictionError
        import numpy as np
        
        if not self.is_loaded():
            raise ModelNotReadyError("TensorFlow model is not loaded yet.")
            
        try:
            input_data = np.array([frames], dtype=np.float32)
            predictions = self.model.predict(input_data, verbose=0)[0]
            
            best_idx = int(np.argmax(predictions))
            confidence = float(predictions[best_idx])
            
            # Resolve class
            label = self._raw_class_map.get(str(best_idx), "Unknown")
            
            # Find the structured id if possible
            sign_id = None
            if self.metadata and best_idx < len(self.metadata.classes):
                sign_id = self.metadata.classes[best_idx].get("id")
                
            if not sign_id:
                sign_id = label.lower().replace(" ", "_").replace("/", "").replace("__", "_").strip("_")
            
            return PredictionResult(
                class_index=best_idx,
                sign_id=sign_id,
                label=label,
                confidence=confidence,
                probabilities=predictions.tolist()
            )
        except Exception as e:
            raise PredictionError(f"TensorFlow inference failed: {e}")
