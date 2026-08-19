# ISL Translation Backend - API Contract

This document provides the frontend developer with exact specifications for connecting to the FastAPI backend.

## 1. Base URL
By default, the backend runs locally on:
`http://localhost:8000`

## 2. Authentication Status
Currently, **none**. All endpoints are open for local development.

---

## 3. GET `/api/health`
Checks if the backend process is alive and responding.

**Response:**
```json
{
  "success": true,
  "status": "healthy",
  "service": "isl-backend"
}
```

---

## 4. GET `/api/ready`
Checks if the backend is fully initialized and capable of serving predictions.
Since the real TensorFlow model is not integrated yet, this correctly returns false/not_ready.

**Response:**
```json
{
  "success": false,
  "status": "not_ready",
  "service": "isl-backend"
}
```

---

## 5. GET `/api/model/status`
Returns detailed status of the ML model.

**Response:**
```json
{
  "success": true,
  "model_loaded": false,
  "model_version": null,
  "status": "waiting_for_model"
}
```
*Possible `status` values: `waiting_for_model`, `model_loading`, `model_ready`, `model_error`.*

---

## 6. POST `/api/translate/sign`
The core prediction endpoint. Even though the real model isn't active, this endpoint responds using a **mock prediction** to unblock frontend integration.

### Request Specification (30x86)
- The request body must be JSON.
- `frames`: A 2D array representing exactly 30 frames.
- Each frame must be a 1D array of exactly 86 numbers.
- **Nulls, NaNs, and Infinity are strictly rejected.**

**Example Request:**
```json
{
  "frames": [
    [0.1, 0.2, 0.3, ... /* 86 values */],
    /* ... exactly 30 arrays ... */
  ]
}
```

**Example Successful Response:**
```json
{
  "success": true,
  "prediction": {
    "label": "MOCK_SIGN",
    "confidence": 0.0
  },
  "model_version": "mock-v1",
  "status": "mock_prediction"
}
```

**Example Validation Failure:**
If you send 29 frames, 85 features, or NaN values, you will receive a `422 Unprocessable Entity`:
```json
{
  "success": false,
  "error": {
    "code": "INVALID_FRAME_DIMENSION",
    "message": "Exactly 30 frames required, got 29."
  }
}
```

---

## 7. GET `/api/history`
Retrieves the temporary in-memory history of translations.

**Response:**
```json
{
  "success": true,
  "history": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "timestamp": "2026-08-19T00:00:00.000Z",
      "prediction": "MOCK_SIGN",
      "confidence": 0.0
    }
  ]
}
```

---

## 8. Error Schemas
The backend hides internal Python errors and normalizes API errors into a consistent schema:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE_HERE",
    "message": "Human readable description."
  }
}
```

### Known Error Codes:
- `INVALID_INPUT` (Malformed JSON, NaNs, incorrect types)
- `INVALID_FRAME_DIMENSION` (Violates 30x86 rule)
- `MODEL_NOT_READY` (Model hasn't loaded yet - 503)
- `PREDICTION_ERROR` (Model crashed during inference - 500)
- `INTERNAL_SERVER_ERROR` (Generic fallback - 500)

---

## 9. Future TensorFlow Integration Point
The API surface will **not change** when the TensorFlow model is deployed. 
- `ModelService` will seamlessly swap `MockModelService` for `TensorFlowModelService`.
- `GET /api/model/status` will report `"model_ready"`.
- `POST /api/translate/sign` will yield accurate `prediction` labels.
