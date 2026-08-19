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

class HistoryResponse(BaseModel):
    success: bool = True
    history: List[HistoryEntry]

# --- Requests ---

class TranslationRequest(BaseModel):
    frames: List[List[float]] = Field(..., description="Sequence of 30 frames, each containing 86 numeric features.")

    @field_validator("frames")
    @classmethod
    def validate_frames(cls, frames: List[List[float]]) -> List[List[float]]:
        if len(frames) != 30:
            raise InvalidFrameDimensionError(f"Exactly 30 frames required, got {len(frames)}.")
        
        for i, frame in enumerate(frames):
            if len(frame) != 86:
                raise InvalidFrameDimensionError(f"Frame {i} must contain exactly 86 features, got {len(frame)}.")
            
            for j, val in enumerate(frame):
                if val is None or not isinstance(val, (int, float)) or math.isnan(val) or math.isinf(val):
                    raise InvalidFeatureError(f"Feature at frame {i}, index {j} is invalid (NaN, Infinity, or not a number).")
                    
        return frames
