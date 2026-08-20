# Backend Architecture

The backend is built using FastAPI, providing a bidirectional translation pipeline for Indian Sign Language (ISL).

## Core Components

1. **Main \& Routers**
   - `main.py`: The entry point of the FastAPI application. Configures CORS, registers global exception handlers, and mounts API routers.
   - `api/endpoints.py`: Defines all API endpoints (/health, /ready, /model/status, /translate/sign, /history, /translate/text-to-sign) and delegates logic to services.

2. **Services**
   - `RecognitionService` (`recognition_service.py`): Orchestrates sign recognition. Injects the underlying ModelService. Applies confidence thresholds (cMODEL_CONFIDENCE_THRESHOLD`).
   - `ModelService`(trait) ( `model_service.py`): Abstracts model inference.
     - `MockModelService`: Used for development and testing. Returns mock predictions.
     - `TensorFlowModelService`: The production model service. Lazily loads TensorFlow and the `.tflite`/`.keras` model when started.
   - `TextToSignService` (`text_translation_service.py`): Handles Text Translation to ISL video mapping, using a static dictionary (`sign_dictionary.py`).
   - `HistoryService` (`history_service.py`): An in-memory store for translation history.

3. **Error Handling**
   - `exceptions.py`: Defines hierarchical custom exceptions based on `ISLAPIError`.
   - These exceptions are caught by `global_exception_handler` in `main.py` and mapped to standardized JSON error responses.

4. **Schemas:**
   - `api.py`: Defines all Pydantic models for requests and responses.
   - Includes custom validation for frame shape (30x 86).

## Dataset Preparation
The backend includes tools to validate and merge Indian Sign Language JSON datasets.

- `scripts/dataset_validator.py`: Reads a single JSON export and checks for shape (30x86), missing fields, duplicates, signer conflicts, and NaNs/Infinity.
- `scripts/dataset_merger.py`: Takes multiple JSON exports, runs the validator, and merges them into a single master dataset for TensorFlow training.