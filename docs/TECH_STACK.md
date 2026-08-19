# Technology Stack

## Frontend (Client)
- **Technology:** Next.js, TypeScript, Tailwind CSS
- **Why we need it:** To provide a responsive, single-codebase web interface for both desktop and mobile users that directly implements the Stitch design.
- **Why chosen over alternatives:** Faster development than maintaining separate native apps (Flutter/React Native). Easier integration with browser APIs for MediaPipe JS and Three.js.
- **Required for MVP:** Yes.

## Backend (API & NLP Services)
- **Technology:** FastAPI (Python)
- **Why we need it:** To process NLP rules, grammar translations, and serve any server-side ML models.
- **Why chosen over alternatives:** Faster than Flask, native async support, and Python is the standard for NLP (SpaCy).
- **Required for MVP:** Yes.

## Machine Learning & Computer Vision
- **Technology:** MediaPipe (Hand/Holistic) & TensorFlow (TFLite/TF.js)
- **Why we need it:** To extract skeletal landmarks from video frames and classify them into ISL gestures.
- **Why chosen over alternatives:** MediaPipe is highly optimized for edge devices and real-time processing compared to running heavy CNNs like YOLO or ResNet on raw frames.
- **Required for MVP:** Yes.

## NLP (Text to ISL Grammar)
- **Technology:** SpaCy (`en_core_web_sm`)
- **Why we need it:** To identify Parts of Speech (POS) and dependency tags to restructure English sentences into ISL SOV grammar.
- **Why chosen over alternatives:** Lightweight, fast, and proven to work well for basic rule-based restructuring in Repo 3.
- **Required for MVP:** Yes.

## Avatar rendering
- **Technology:** React Three Fiber / Three.js
- **Why we need it:** To render 3D avatars performing ISL.
- **Why chosen over alternatives:** Integrates natively with React. SiGML requires specific deprecated plugins or heavy WebGL implementations. JSON-based animations in Three.js are more portable.
- **Required for MVP:** Yes.

## Database
- **Technology:** SQLite (Phase 1/MVP), PostgreSQL (Phase 2)
- **Why we need it:** To store user profiles, custom sign dictionaries, and history.
- **Required for MVP:** No.

## Speech-to-Text & Text-to-Speech
- **Technology:** Web Speech API (Browser native)
- **Why we need it:** To allow voice input and output.
- **Why chosen over alternatives:** Zero cost, zero latency API calls. Can be upgraded to Whisper if accuracy is too low.
- **Required for MVP:** Partial (nice to have, Text is priority).
