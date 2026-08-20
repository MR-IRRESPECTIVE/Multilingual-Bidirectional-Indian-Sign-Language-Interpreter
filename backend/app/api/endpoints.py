from fastapi import APIRouter, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from app.schemas.api import (
    HealthResponse,
    ReadyResponse,
    DetailedModelStatusResponse,
    TranslationRequest,
    SignRecognitionResponse,
    SignPrediction,
    ModelInfo,
    HistoryResponse,
    HistoryEntry,
    ErrorResponse,
    ErrorDetail,
    TextToSignRequest,
    TextToSignResponse,
    SignData
)
from app.services.model_service import MockModelService, ModelStatus
from app.services.recognition_service import RecognitionService
from app.services.history_service import history_service
from app.services.text_translation_service import text_translation_service
from app.core.exceptions import ModelNotReadyError
from app.core.config import settings

api_router = APIRouter()
model_service = MockModelService(should_load=False)
recognition_service = RecognitionService(model_service)

@api_router.get("/health", response_model=HealthResponse)
async def get_health():
    return HealthResponse(success=True, status="healthy", service="isl-backend")
    
@api_router.get("/ready", response_model=ReadyResponse)
async def get_ready():
    is_ready = recognition_service.is_model_loaded()
    return ReadyResponse(
        success=is_ready, 
        status="ready" if is_ready else "not_ready", 
        service="isl-backend"
    )

@api_router.get("/model/status", response_model=DetailedModelStatusResponse)
async def get_model_status():
    status_val = recognition_service.get_model_status()
    is_loaded = recognition_service.is_model_loaded()
    meta = recognition_service.get_model_metadata()
    
    return DetailedModelStatusResponse(
        success=True,
        loaded=is_loaded,
        model_version=meta.model_version if meta else None,
        feature_generation=meta.feature_generation if meta else "v2-86",
        feature_dimension=meta.feature_dimension if meta else 86,
        frame_count=meta.frame_count if meta else 30,
        classes=meta.classes if meta else [],
        status=status_val.value
    )

@api_router.post("/translate/sign", response_model=SignRecognitionResponse)
async def translate_sign(request_data: TranslationRequest):
    result = recognition_service.recognize(request_data.frames)
    
    history_service.add_entry(
        prediction=result.label,
        confidence=result.confidence,
        model_version=result.model_version,
        direction="sign-to-text"
    )
    
    return SignRecognitionResponse(
        success=True,
        prediction=SignPrediction(
            sign_id=result.sign_id,
            label=result.label,
            confidence=result.confidence
        ),
        model=ModelInfo(
            version=result.model_version,
            feature_generation=result.feature_generation
        )
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

@api_router.post("/translate/text-to-sign", response_model=TextToSignResponse)
async def translate_text_to_sign(request_data: TextToSignRequest):
    result = text_translation_service.translate(request_data.text)
    
    history_service.add_entry(
        prediction="T " + result.input_text,
        confidence=1.0,
        model_version="dictionary-v1",
        direction="text-to-sign"
    )
    
    return TextToSignResponse(
        success=True,
        input_text=result.input_text,
        normalized_text=result.normalized_text,
        gloss=result.gloss,
        signs=[
            SignData(
                id=sign.id,
                label=sign.label,
                video_url=sign.video
            )
            for sign in result.signs
        ],
        unsupported_words=result.unsupported_words
    )
