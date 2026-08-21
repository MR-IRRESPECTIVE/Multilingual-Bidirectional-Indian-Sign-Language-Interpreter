from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from app.core.config import settings
from app.api.endpoints import api_router
from app.core.exceptions import (
    ModelNotReadyError, 
    PredictionError, 
    InvalidFrameDimensionError, 
    InvalidFeatureError,
    EmptyInputError,
    ModelMetadataMismatchError
)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend services for Multilingual Bidirectional Indian Sign Language Interpreter",
    version=settings.VERSION
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    msg = str(exc)
    code = "INVALID_INPUT"
    if errors:
        msg = errors[0].get("msg", str(exc))
        if "Sequence length must be between 15 and 30 frames" in msg:
            code = "INVALID_FRAME_SHAPE"
        elif "Exactly 30 frames required" in msg:
            code = "INVALID_FRAME_SHAPE"
        elif "exactly 86 features" in msg:
            code = "INVALID_FEATURE_DIMENSION"
        elif "invalid (NaN, Infinity" in msg or "Non-finite" in msg or "valid number" in msg:
            code = "NON_FINITE_FEATURES"
        elif "Input text cannot be empty" in msg:
            code = "EMPTY_INPUT"
            
    if msg.startswith("Value error, "):
        msg = msg[len("Value error, "):]
        
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "error": {
                "code": code,
                "message": msg
            }
        }
    )

@app.exception_handler(ModelNotReadyError)
async def model_not_ready_handler(request: Request, exc: ModelNotReadyError):
    return JSONResponse(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        content={
            "success": False,
            "error": {
                "code": "MODEL_NOT_READY",
                "message": str(exc)
            }
        }
    )

@app.exception_handler(PredictionError)
async def prediction_error_handler(request: Request, exc: PredictionError):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error": {
                "code": "PREDICTION_ERROR",
                "message": str(exc)
            }
        }
    )

@app.exception_handler(EmptyInputError)
async def empty_input_handler(request: Request, exc: EmptyInputError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "error": {
                "code": "EMPTY_INPUT",
                "message": str(exc)
            }
        }
    )

@app.exception_handler(ModelMetadataMismatchError)
async def model_metadata_mismatch_handler(request: Request, exc: ModelMetadataMismatchError):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error": {
                "code": "MODEL_METADATA_MISMATCH",
                "message": str(exc)
            }
        }
    )

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error": {
                "code": "INTERNAL_ERROR",
                "message": "An unexpected internal server error occurred."
            }
        }
    )

app.include_router(api_router, prefix=settings.API_PREFIX)
