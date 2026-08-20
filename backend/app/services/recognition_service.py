from typing import Optional
from dataclasses import dataclass
from app.services.model_service import ModelService, ModelMetadata, ModelStatus
from app.core.config import settings

@dataclass
class RecognitionResult:
    sign_id: Optional[str]
    label: str
    confidence: float
    model_version: Optional[str]
    feature_generation: str
    above_threshold: bool

class RecognitionService:
    def __init__(self, model_service: ModelService):
        self.model_service = model_service
        self.threshold = settings.MODEL_CONFIDENCE_THRESHOLD

    def is_model_loaded(self) -> bool:
        return self.model_service.is_loaded()

    def get_model_metadata(self) -> Optional[ModelMetadata]:
        return self.model_service.get_metadata()

    def get_model_status(self) -> ModelStatus:
        return self.model_service.get_status()

    def recognize(self, frames: list[list[float]]) -> RecognitionResult:
        prediction = self.model_service.predict(frames)
        
        metadata = self.get_model_metadata()
        model_version = metadata.model_version if metadata else self.model_service.get_version()
        feature_generation = metadata.feature_generation if metadata else "v2-86"
        above_threshold = prediction.confidence >= self.threshold

        if above_threshold:
            return RecognitionResult(
                sign_id=prediction.sign_id,
                label=prediction.label,
                confidence=prediction.confidence,
                model_version=model_version,
                feature_generation=feature_generation,
                above_threshold=True
            )
        else:
            return RecognitionResult(
                sign_id=None,
                label="Unknown",
                confidence=prediction.confidence,
                model_version=model_version,
                feature_generation=feature_generation,
                above_threshold=False
            )
