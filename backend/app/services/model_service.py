from abc import ABC, abstractmethod
from typing import List, Tuple
from enum import Enum

class ModelStatus(str, Enum):
    WAITING = "waiting_for_model"
    LOADING = "model_loading"
    READY = "model_ready"
    ERROR = "model_error"

class ModelService(ABC):
    @abstractmethod
    def get_status(self) -> ModelStatus:
        """Returns the current state of the model."""
        pass
        
    @abstractmethod
    def is_loaded(self) -> bool:
        """Returns True if the ML model is fully loaded and ready to serve."""
        pass

    @abstractmethod
    def get_version(self) -> str | None:
        """Returns the loaded model version string, or None if unavailable."""
        pass

    @abstractmethod
    def predict(self, frames: List[List[float]]) -> Tuple[str, float]:
        """
        Takes 30x86 frames and returns a tuple of (prediction_label, confidence).
        Throws ModelNotReadyError if not loaded.
        Throws PredictionError if inference fails.
        """
        pass

class MockModelService(ModelService):
    def __init__(self):
        self._version = "mock-v1"

    def get_status(self) -> ModelStatus:
        # As requested, clearly return waiting_for_model since real model isn't there
        return ModelStatus.WAITING

    def is_loaded(self) -> bool:
        # Mock service intentionally returns False as requested to not pretend a real model exists
        # However, for integration purposes, it will still answer predict() calls.
        return False

    def get_version(self) -> str | None:
        return self._version

    def predict(self, frames: List[List[float]]) -> Tuple[str, float]:
        # Placeholder logic testing the pipeline
        return ("MOCK_SIGN", 0.0)

# The abstraction layer ready for future TensorFlow integration
class TensorFlowModelService(ModelService):
    def __init__(self):
        self.model = None

    def get_status(self) -> ModelStatus:
        if self.model is None:
            return ModelStatus.WAITING
        return ModelStatus.READY

    def is_loaded(self) -> bool:
        return self.model is not None

    def get_version(self) -> str | None:
        return None

    def predict(self, frames: List[List[float]]) -> Tuple[str, float]:
        from app.core.exceptions import ModelNotReadyError
        if not self.is_loaded():
            raise ModelNotReadyError("TensorFlow model is not loaded yet.")
        raise NotImplementedError("TensorFlowModelService is not implemented yet.")
