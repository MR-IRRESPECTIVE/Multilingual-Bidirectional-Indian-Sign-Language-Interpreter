from fastapi import APIRouter, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from app.schemas.api import (
    HealthResponse,
    ReadyResponse,
    ModelStatusResponse,
    TranslationRequest,
    TranslationResponse,
    PredictionData,
    HistoryResponse,
    HistoryEntry,
    ErrorResponse,
    ErrorDetail
)
from app.services.model_service import MockModelService, ModelStatus
from app.services.history_service import history_service
from app.core.exceptions import ModelNotReadyError

api_router = APIRouter()
model_service = MockModelService()

@api_router.get("/health", response_model=HealthResponse)
async def get_health():
    """Returns basic liveliness of the backend process."""
    return HealthResponse(success=True, status="healthy", service="isl-backend")
    
@api_router.get("/ready", response_model=ReadyResponse)
async def get_ready():
    """Returns readiness to serve traffic (requires model to be loaded)."""
    # Since real model is not ready, this accurately returns false/not-ready
    is_ready = model_service.is_loaded()
    return ReadyResponse(
        success=is_ready, 
        status="ready" if is_ready else "not_ready", 
        service="isl-backend"
    )

@api_router.get("/model/status", response_model=ModelStatusResponse)
async def get_model_status():
    """Returns detailed status of the ML model."""
    status_val = model_service.get_status()
    is_loaded = model_service.is_loaded()
    return ModelStatusResponse(
        success=True,
        model_loaded=is_loaded,
        model_version=model_service.get_version() if is_loaded else None,
        status=status_val.value
    )

@api_router.post("/translate/sign", response_model=TranslationResponse)
async def translate_sign(request_data: TranslationRequest):
    # For now, we allow MockModelService to process the integration request even if is_loaded() is False, 
    # to fulfill the frontend integration test phase requirements.
    
    prediction_label, confidence = model_service.predict(request_data.frames)
    
    # Save to history
    history_service.add_entry(prediction_label, confidence)
    
    return TranslationResponse(
        success=True,
        prediction=PredictionData(label=prediction_label, confidence=confidence),
        model_version=model_service.get_version() or "unknown",
        status="mock_prediction"
    )

@api_router.get("/history", response_model=HistoryResponse)
async def get_history():
    return HistoryResponse(
        success=True,
        history=history_service.get_history()
    )

@api_router.post("/history", response_model=HistoryResponse)
async def post_history(entry: HistoryEntry):
    history_service._history.append(entry)
    return HistoryResponse(success=True, history=history_service.get_history())
