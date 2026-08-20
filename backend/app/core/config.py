import os
from pydantic import BaseModel
from typing import List

class Settings(BaseModel):
    PROJECT_NAME: str = "ISL Translation Backend MVP"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"

    API_HOST: str = os.getenv("API_HOST", "0.0.0.0")
    API_PORT: int = int(os.getenv("API_PORT", "8000"))
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    CORS_ORIGINS_STR: str = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
    
    @property
    def CORS_ORIGINS(self) -> List[str]:
        return [url.strip() for url in self.CORS_ORIGINS_STR.split(",") if url.strip()]
        
    MODEL_DIR: str = os.getenv("MODEL_DIR", os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "models", "current")))
    MODEL_CONFIDENCE_THRESHOLD: float = float(os.getenv("MODEL_CONFIDENCE_THRESHOLD", "0.70"))

settings = Settings()