import uuid
from datetime import datetime
from typing import List
from app.schemas.api import HistoryEntry

class HistoryService:
    def __init__(self):
        # In-memory storage. 
        # WARNING: Restarting the backend will erase this temporary data.
        self._history: List[HistoryEntry] = []

    def add_entry(self, prediction: str, confidence: float) -> HistoryEntry:
        entry = HistoryEntry(
            id=str(uuid.uuid4()),
            timestamp=datetime.utcnow().isoformat() + "Z",
            prediction=prediction,
            confidence=confidence
        )
        self._history.append(entry)
        return entry

    def get_history(self) -> List[HistoryEntry]:
        return self._history

# Global singleton for in-memory persistence
history_service = HistoryService()
