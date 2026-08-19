# ISL Translation Backend Architecture

## Overview
This backend serves as the bridge between the React/Next.js frontend (data collection & streaming) and the future TensorFlow ML translation model.

**Framework**: Python + FastAPI
**Data Validation**: Pydantic
**Current ML State**: MOCK_MODEL (Awaiting real TensorFlow deployment)
**Persistence**: In-Memory (No database required yet)

## Architecture

The backend follows a modular, scalable pattern:
- **`app/api/endpoints.py`**: Defines HTTP routes and API contracts.
- **`app/core/config.py`**: Environment variables supporting dynamic CORS domains (e.g., `FRONTEND_URLS`).
- **`app/core/exceptions.py`**: Custom mapped validation and model errors.
- **`app/schemas/api.py`**: Pydantic schemas standardizing requests and responses, enforcing strict validation logic (e.g., exactly 30 frames, 86 numeric features).
- **`app/services/model_service.py`**: Abstraction layer allowing us to hot-swap models without modifying API routes.
    - `ModelService` (Base Interface)
    - `MockModelService` (Current MVP)
    - `TensorFlowModelService` (Future implementation)
- **`app/services/history_service.py`**: In-memory repository handling translation history.

## Running the Application

### 1. Prerequisites
- Python 3.10+
- Virtual Environment recommended

### 2. Installation
```bash
cd backend
python -m venv venv
venv\Scripts\activate      # Windows
# source venv/bin/activate # Mac/Linux

pip install -r requirements.txt
```

### 3. Running Locally
```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
By default, CORS is allowed for `http://localhost:3000` and `http://127.0.0.1:3000`. You can override this using the `FRONTEND_URLS` environment variable (comma-separated).

## For Frontend Developers
Please reference [API_CONTRACT.md](./API_CONTRACT.md) for the exact payload structures, status codes, error shapes, and interaction flows.

## Future ML/Database Integration Plan
1. Introduce a proper relational database (e.g., PostgreSQL) or Document store (e.g., MongoDB).
2. Create `app/models/` for ORM/ODM definitions.
3. Replace `MockModelService` with `TensorFlowModelService`.
4. The API endpoints and response schemas will remain structurally identical.
