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
    InvalidFeatureError
)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend services for Multilingual Bidirectional Indian Sign Language Interpreter",
    version=settings.VERSION
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.FRONTEND_URLS,
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
        # Pydantic v2 swallows our custom Exception type in the traceback, 
        # so we can deduce the code from the message format we provided.
        if "Exactly 30 frames required" in msg or "must contain exactly 86 features" in msg:
            code = "INVALID_FRAME_DIMENSION"
            
    # For robust handling, we strip the 'Value error, ' prefix added by Pydantic
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

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected internal server error occurred."
            }
        }
    )

app.include_router(api_router, prefix=settings.API_PREFIX)
