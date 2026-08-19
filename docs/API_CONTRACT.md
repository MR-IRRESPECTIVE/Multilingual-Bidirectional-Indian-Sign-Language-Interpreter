# API Contract

This document outlines the API boundary between the Next.js frontend and the FastAPI backend.

## 1. Translate English/Hindi Text to ISL Gloss
**STATUS:** PROPOSED

- **Endpoint:** `/api/v1/translate/text-to-isl`
- **Method:** `POST`
- **Description:** Takes an English or Hindi sentence, processes it through SpaCy (or translation API for Hindi), and returns the mapped ISL Gloss structure.
- **Request Schema:**
  ```json
  {
    "text": "What is your name?",
    "source_language": "en" 
  }
  ```
- **Response Schema (Success):**
  ```json
  {
    "original_text": "What is your name?",
    "isl_gloss": ["YOUR", "NAME", "WHAT"],
    "confidence": 0.95
  }
  ```
- **Status Codes:**
  - `200 OK`: Successful translation.
  - `400 Bad Request`: Missing text or unsupported language.
  - `500 Internal Server Error`: NLP processing failure.
- **Error Format:**
  ```json
  {
    "detail": "Unsupported source_language."
  }
  ```
- **Timeout Behavior:** The frontend will timeout the request after 5000ms.
- **Frontend States:**
  - *Loading:* Display skeleton loader or loading spinner in the chat bubble.
  - *Success:* Render the ISL gloss and trigger the Avatar animation sequence.
  - *Failure:* Display "Translation unavailable" in red with a retry button.

## 2. Speech to Text (Fallback if local processing fails)
**STATUS:** PROPOSED

- **Endpoint:** `/api/v1/speech/transcribe`
- **Method:** `POST`
- **Description:** Accepts audio blob (e.g., from the browser microphone) and returns the transcribed text.
- **Request Schema:** `multipart/form-data` containing `audio_file` and `language`.
- **Response Schema:**
  ```json
  {
    "text": "Transcribed speech goes here."
  }
  ```

*Note: For the MVP, camera frames are NOT uploaded to an API. Computer vision (MediaPipe) runs locally in the browser.*
