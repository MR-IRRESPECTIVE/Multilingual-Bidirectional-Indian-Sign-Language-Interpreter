# ISL Recognition Current Architecture

## Current Pipeline
The current architecture processes webcam frames in real-time on the client and sends extracted landmarks to a FastAPI backend.
The pipeline consists of:
1. **Frontend Capture**: Next.js / React application captures webcam frames.
2. **MediaPipe Landmark Extraction**: Uses MediaPipe to extract hand landmarks (XY/XYZ).
3. **Feature Generation**: The system supports multiple feature extraction versions:
   - **Static (42-feature)**: `static_v1` - 42 floats representing wrist-relative, max-abs normalized XY landmarks for one hand.
   - **Temporal (v2-86)**: `v2-86` - 86 features representing both hands and body posture over time.
4. **Backend Inference**: FastAPI exposes endpoints that route preprocessed feature arrays to the respective TensorFlow/Keras models.
5. **UI Updates**: Prediction results and confidences are streamed back to the frontend for display and smoothing/debouncing.

## Current Models
1. **Static Model (ANN)**:
   - Handled by `StaticModelService`.
   - Used for static gestures (like alphabets or numbers).
   - Input: `[42]` - 42 floats per frame.
2. **Temporal Model (BiLSTM)**:
   - Handled by `TensorFlowModelService` (and potentially `atharv_service.py`).
   - Used for dynamic signs (sequences).
   - Input: `[30, 86]` - 30 frames of 86 features each.
   - Preprocessing includes temporal padding/interpolation (`validate_and_preprocess`).

## Existing Endpoints
- A backend FastAPI service with dedicated routes for `StaticModelService` and `TensorFlowModelService`.
- Exposes predicted class label, confidence, and array of probabilities.

## Known Limitations and Failures
- The models suffer from unreliable real-world webcam performance.
- Alphabets and numbers specifically had accuracy problems in previous iterations.
- Temporal models struggle with natural transitions between signs and varying speeds of execution.
- Real-time webcam conditions (lighting, distance, angle) severely degrade accuracy despite normalization techniques.
- Previous attempts to improve accuracy focused heavily on preprocessing rather than adopting fundamentally better models or datasets.

## Goal for ThrisheiyanUK Evaluation
We are temporarily freezing the current architecture to evaluate the `ThrisheiyanUK` implementation on a live webcam. The new model will ONLY be integrated if it proves definitively better at recognizing signs in real-world conditions without hallucinating transitions.
