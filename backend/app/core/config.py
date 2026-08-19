import os
from pydantic import BaseModel
from typing import List

class Settings(BaseModel):
    PROJECT_NAME: str = "ISL Translation Backend MVP"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # Comma-separated list of allowed origins
    FRONTEND_URLS_STR: str = os.getenv("FRONTEND_URLS", "http://localhost:3000,http://127.0.0.1:3000")
    
    @property
    def FRONTEND_URLS(self) -> List[str]:
        return [url.strip() for url in self.FRONTEND_URLS_STR.split(",") if url.strip()]
        
    MODEL_SERVICE_URL: str = os.getenv("MODEL_SERVICE_URL", "")

settings = Settings()
