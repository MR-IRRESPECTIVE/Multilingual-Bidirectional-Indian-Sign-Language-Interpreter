# ISL Translation Backend - API Contract

This document provides the frontend developer with exact specifications for connecting to the FastAPI backend.

## 1. Base URL
By default, the backend runs locally on:
http://localhost:8000

## 2. Authentication Status
Currently, **none**. All endpoints are open for local development.

---

## 3. GET /api/health
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

## 4. GET /api/ready
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

## 5. GET /api/model/status
Returns detailed status of the ML model.

**Response:**
```json
{
  "success": true,
  "loaded": false,
  "model_version": null,
  "feature_generation": "v2-86",
  "feature_dimension": 86,
  "frame_count": 30,
  "classes": [],
  "status": "waiting_for_model"
}
```
*Note: status enum values include: waiting_for_model, model_loading, model_ready, model_error.*

---

## 6. POST /api/translate/sign

Translates a sequence of pose landmarks into a sign language string.

### Request Body

```json
{
  "frames": [
    [0.1, 0.2, 0.3, ...], 
    // ... exactly 30 frames, each with exactly 86 float values
  ]
}
```

### Response 200 OK

```json
{
  "success": true,
  "prediction": {
    "sign_id": "hello",
    "label": "Hello",
    "confidence": 0.94
  },
  "model": {
    "version": "pilot-v1",
    "feature_generation": "v2-86"
  }
}
```

*Note: If the prediction confidence is below the configured threshold, sign_id will be null and label will be "Unknown".*

### Error Responses

- 422 Unprocessable Entity (INVALID_FRAME_SHAPE): If the number of frames is not exactly 30.
- 422 Unprocessable Entity (INVALID_FEATURE_DIMENSION): If any frame does not have exactly 86 values.
- 422 Unprocessable Entity (NON_FINITE_FEATURES): If frames contain invalid types, NaN, or Infinity.
- 503 Service Unavailable (MODEL_NOT_READY): If the ML model is not yet loaded into memory.
- 500 Internal Server Error (MODEL_METADATA_MISMATCH): If the loaded model's metadata doesn't match the expected v2-86 feature generation specification.

---

## 7. GET /api/history
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
      "confidence": 0.0,
      "model_version": "mock-v1",
      "direction": "sign-to-text",
      "metadata": {}
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
- INVALID_INPUT (Malformed JSON, generic unprocessable entity)
- INVALID_FRAME_SHAPE (<30 or >30 frames)
- INVALID_FEATURE_DIMENSION (<86 or >86 features)
- NON_FINITE_FEATURES (NaN, Infinity, missing values)
- EMPTY_INPUT (Text-to-sign input is empty or whitespace-only)
- MODEL_NOT_READY (Model hasn't loaded yet - 503)
- MODEL_METADATA_MISMATCH (Model config is wrong - 500)
- PREDICTION_ERROR (Model crashed during inference - 500)
- INTERNAL_ERROR (Generic fallback - 500)

---

## 9. POST /api/translate/text-to-sign
Translates text input into a sequence of ISL signs with video URLs (Direction B: Text -> ISL).

### Request Specification
- The request body must be JSON.
- text: A non-empty string containing words to translate.

**Example Request:**
```json
{
  "text": "hello"
}
```

### Successful Response (single word):
```json
{
  "success": true,
  "input_text": "hello",
  "normalized_text": "hello",
  "gloss": ["HELLO"],
  "signs": [
    {
      "id": "hello",
      "label": "Hello",
      "video_url": "/signs/hello.mp4"
    }
  ],
  "unsupported_words": []
}
```

### Successful Response (multi-word with partial matches):
For input "I want to eat", words I, want, to are not in the vocabulary and are returned as unsupported:
```json
{
  "success": true,
  "input_text": "I want to eat",
  "normalized_text": "i want to eat",
  "gloss": ["EAT"],
  "signs": [
    {
      "id": "eat_food",
      "label": "Eat / Food",
      "video_url": "/signs/eat_food.mp4"
    }
  ],
  "unsupported_words": ["i", "want", "to"]
}
```

### Successful Response (all words unsupported):
```json
{
  "success": true,
  "input_text": "xyzunknown",
  "normalized_text": "xyzunknown",
  "gloss": [],
  "signs": [],
  "unsupported_words": ["xyzunknown"]
}
```

### Text Normalization
The following normalizations are applied before lookup:
- Trim leading/trailing whitespace
- Convert to lowercase
- Remove punctuation (keep alphanumeric and spaces)
- Collapse multiple spaces to a single space

This means "HELLO!", "  hello  ", and "hello" all resolve to the same sign.

### Empty Input Error (422):
```json
{
  "success": false,
  "error": {
    "code": "EMPTY_INPUT",
    "message": "Input text cannot be empty."
  }
}
```

### Supported MVP Signs
| Sign ID | Label | Aliases |
|---|---|---|
| hello | Hello | hello, hi |
| sorry | Sorry | sorry |
| eat_food | Eat / Food | eat, food |
| indian | Indian | indian, india |
| namaste | Namaste | namaste |
| thank_you | Thank You | thank, thanks |
| love | Love | love |
| good | Good | good, great, nice |
| yes | Yes | yes, yeah, yep |
| no | No | no |

---

The API surface will **not change** when the TensorFlow model is deployed. 
- ModelService will seamlessly swap MockModelService for TensorFlowModelService.
- GET /api/model/status will report "model_ready".
- POST /api/translate/sign will yield accurate prediction labels.