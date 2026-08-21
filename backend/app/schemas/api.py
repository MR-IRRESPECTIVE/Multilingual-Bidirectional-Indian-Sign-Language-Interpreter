import math
from typing import List, Optional, Any
from pydantic import BaseModel, Field, field_validator
from app.core.exceptions import InvalidFrameDimensionError, InvalidFeatureError

# --- Responses ---

class HealthResponse(BaseModel):
    success: bool = True
    status: str = "healthy"
    service: str = "isl-backend"
    
class ReadyResponse(BaseModel):
    success: bool
    status: str
    service: str = "isl-backend"

class ModelStatusResponse(BaseModel):
    success: bool = True
    model_loaded: bool = False
    model_version: Optional[str] = None
    status: str = "waiting_for_model"

class PredictionData(BaseModel):
    label: str
    confidence: float

class TranslationResponse(BaseModel):
    success: bool = True
    prediction: PredictionData
    model_version: str
    status: str

class ErrorDetail(BaseModel):
    code: str
    message: str

class ErrorResponse(BaseModel):
    success: bool = False
    error: ErrorDetail

class HistoryEntry(BaseModel):
    id: str
    timestamp: str
    prediction: str
    confidence: float
    model_version: Optional[str] = None
    direction: Optional[str] = None
    metadata: Optional[dict] = None

class HistoryResponse(BaseModel):
    success: bool = True
    history: List[HistoryEntry]

class SignPrediction(BaseModel):
    sign_id: Optional[str] = None
    label: str
    confidence: float
    probabilities: Optional[dict] = None

class ModelInfo(BaseModel):
    version: Optional[str] = None
    feature_generation: str = "v2-86"

class SignRecognitionResponse(BaseModel):
    success: bool = True
    prediction: SignPrediction
    model: ModelInfo

class DetailedModelStatusResponse(BaseModel):
    success: bool = True
    loaded: bool = False
    model_version: Optional[str] = None
    feature_generation: str = "v2-86"
    feature_dimension: int = 86
    frame_count: int = 30
    classes: List[dict] = Field(default_factory=list)
    status: str = "waiting_for_model"

# --- Requests ---

class TranslationRequest(BaseModel):
    frames: List[List[float]] = Field(..., description="Sequence of 15 to 30 frames, each containing 86 numeric features.")

    @field_validator("frames")
    @classmethod
    def validate_frames(cls, frames: List[List[float]]) -> List[List[float]]:
        if not (15 <= len(frames) <= 30):
            raise InvalidFrameDimensionError(f"Sequence length must be between 15 and 30 frames, got {len(frames)}.")
        
        for i, frame in enumerate(frames):
            if len(frame) != 86:
                raise InvalidFrameDimensionError(f"Frame {i} must contain exactly 86 features, got {len(frame)}.")
            
            for j, val in enumerate(frame):
                if val is None or not isinstance(val, (int, float)) or math.isnan(val) or math.isinf(val):
                    raise InvalidFeatureError(f"Feature at frame {i}, index {j} is invalid (NaN, Infinity, or not a number).")
                    
        return frames

# --- Text-to-Sign Schemas ---

class TextToSignRequest(BaseModel):
    text: str = Field(..., description="Text to translate into ISL signs.")
    
    @field_validator("text")
    @classmethod
    def validate_text(cls, text: str) -> str:
        if not text or not text.strip():
            from app.core.exceptions import EmptyInputError
            raise EmptyInputError("Input text cannot be empty.")
        return text

class SignData(BaseModel):
    id: str
    label: str
    video_url: Optional[str] = ""

class TextToSignResponse(BaseModel):
    success: bool = True
    input_text: str
    normalized_text: str
    gloss: List[str]
    signs: List[SignData]
    unsupported_words: List[str] = Field(default_factory=list)

# --- Static Sign Recognition Schemas ---

class StaticRecognitionRequest(BaseModel):
    features: List[float] = Field(..., description="42 landmark features for a single hand (wrist-relative, max-abs normalised, XY only).")

    @field_validator("features")
    @classmethod
    def validate_features(cls, features: List[float]) -> List[float]:
        if len(features) != 42:
            raise InvalidFrameDimensionError(f"Static model expects exactly 42 features, got {len(features)}.")

        for i, val in enumerate(features):
            if val is None or not isinstance(val, (int, float)) or math.isnan(val) or math.isinf(val):
                raise InvalidFeatureError(f"Feature at index {i} is invalid (NaN, Infinity, or not a number).")

        return features

