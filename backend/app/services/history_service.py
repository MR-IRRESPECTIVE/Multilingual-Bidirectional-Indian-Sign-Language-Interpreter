import uuid
from datetime import datetime
from typing import List
from app.schemas.api import HistoryEntry

class HistoryService:
    def __init__(self):
        # In-memory storage. 
        # WARNING: Restarting the backend will erase this temporary data.
        self._history: List[HistoryEntry] = []

    def add_entry(self, prediction: str, confidence: float, model_version: str = None, direction: str = None, metadata: dict = None) -> HistoryEntry:
        from datetime import datetime, timezone
        entry = HistoryEntry(
            id=str(uuid.uuid4()),
            timestamp=datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
            prediction=prediction,
            confidence=confidence,
            model_version=model_version,
            direction=direction,
            metadata=metadata or {}
        )
        self._history.append(entry)
        return entry

    def get_history(self) -> List[HistoryEntry]:
        return self._history

# Global singleton for in-memory persistence
history_service = HistoryService()
