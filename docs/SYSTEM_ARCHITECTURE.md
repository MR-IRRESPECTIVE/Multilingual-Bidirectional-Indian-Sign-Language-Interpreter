# System Architecture

## VERIFIED High-Level Architecture (Phase 2B)

```text
+-----------------------------------------------------------+
|                  FRONTEND (Next.js / React)               |
|                                                           |
|  [ Text/Speech Input ]             [ 3D Avatar Output ]   |
|            |                                ^             |
|            v                                |             |
|  (Send via REST API)           (Play JSON/GLTF Animation) |
|                                                           |
|-----------------------------------------------------------|
|  [ WebCam Video Feed ]             [ Text/Speech Output ] |
|            |                                ^             |
|            v                                |             |
|  (MediaPipe JS -> 30-frame buffer)          |             |
|  (1D CNN TF.js Local Inference)    (Display on screen)    |
+-----------------------------------------------------------+
             |                                ^
        (HTTP POST)                     (HTTP Response)
             v                                |
+-----------------------------------------------------------+
|                   BACKEND (FastAPI / Python)              |
|                                                           |
|                 [ NLP Processing (SpaCy) ]                |
|      (English/Hindi -> ISL Grammar/Gloss Mapping)         |
+-----------------------------------------------------------+
```

*Note: For the MVP, to reduce network latency and ensure privacy, the Computer Vision (MediaPipe) and ML Model (ISL to Text) will run entirely on the Client-side using MediaPipe JS and TensorFlow.js. The backend is strictly reserved for heavy NLP processing (SpaCy) and translation APIs.*
