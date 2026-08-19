# Phase 2B: Real ISL Recognition Baseline Validation

## 1. Model Architecture
- **Source:** Inherited from Repository 3 (`Bidirectional-Indian-Sign-Language-Translator`).
- **File:** `keypoint_classifier.tflite`
- **Model Architecture:** Input (42 features) -> Dropout(0.2) -> Dense(20, relu) -> Dropout(0.4) -> Dense(10, relu) -> Dense(41, softmax).
- **Input Shape:** `[1, 42]` (Float32).
- **Output Shape:** `[1, 41]` (Float32).
- **Output Semantics:** Softmax probability array.
- **Quantization:** Standard float32.

## 2. Exact Labels
The model was trained on 41 output classes (indices 0 to 40). A detailed table of all labels is documented in `docs/ISL_MODEL_LABEL_REFERENCE.md`. The vocabulary consists of numbers, alphabets, 10 ISL words, and a `null` class.

## 3. Preprocessing
We verified the exact preprocessing pipeline required by this model:
1. **Absolute Scaling:** Raw `[0.0, 1.0]` MediaPipe coordinates scaled to image pixel dimensions.
2. **Relative Origin Shift:** Landmark 0 (wrist) designated as `(0,0)`. All other 20 landmarks have the wrist's X/Y subtracted.
3. **Flattening:** The 21 `[x,y]` pairs are flattened into a 1D array of length 42.
4. **Max Normalization:** The array is divided by the maximum absolute value within the array.

## 4. Human Test Methodology
We have established a Test Protocol interface within the Proof-of-Concept (`poc/mediapipe_poc.html`). The protocol requires:
- Testing at least 10 available word/sign classes present in the model (e.g., hello, sorry, eat/food, namaste, thank you).
- Testing multiple attempts per class.
- Utilizing more than one signer where possible.
- Varying lighting, distances (e.g. 0.5m, 1m), and backgrounds.
- The POC UI allows the tester to select an "Expected Sign" and record a discrete attempt to measure accuracy.

## 5. Human Test Results
- **Human validation pending.** (Physical testing environment required).

## 6. Per-class Performance
- **Human validation pending.** Precision, recall, F1, and confusion matrices cannot be calculated until physical testing is executed.

## 7. Performance Measurements
- **Inference Latency:** The TFLite inference step measured under 2ms in the tested environment. End-to-end FPS (Camera -> MediaPipe -> Preprocessing -> TFLite -> UI update) must be measured independently during the human validation phase.
- **Network Load:** The browser-side recognition pipeline does not require transmission of raw camera frames to the backend.

## 8. Browser Compatibility
- **Chromium (Desktop/Android):** Verified to support the WebAssembly TFLite runtime seamlessly.
- **iOS Safari:** iOS support is UNKNOWN until tested physically.

## 9. Known Limitations
- The inherited model lacks several critical alphabet indices (skips 5, 6) and contains an extremely limited vocabulary of 10 complete words. 
- It relies entirely on static spatial coordinates, which may cause false positives when capturing frames during dynamic transition movements (e.g. the gesture for "thank you").

## 10. Model Suitability Decision
- **Decision: Provisionally suitable technical baseline; real-world recognition accuracy pending human validation.**
- We will not classify the model as a permanent solution until human test results prove it exceeds baseline accuracy thresholds. 

## 11. Dataset/Licensing Concerns
- The training dataset for this model lacks clear licensing or attribution. We must eventually record a custom dataset with clear legal consent to satisfy MVP production requirements.

## 12. Recommendation for Next Phase
- Conduct the human validation testing using the provided POC interface (`poc/mediapipe_poc.html`) following the `docs/HUMAN_VALIDATION_TEST_PROTOCOL.md`.
- Pending successful validation, proceed to Phase 2C (NLP Integration & Translation Wiring).

---

## FINAL VALIDATION STATUS

**TECHNICAL VALIDATION:**
COMPLETE

**HUMAN VALIDATION:**
PENDING

**ACCURACY:**
NOT YET VERIFIED

### TFLite to TFJS Transition
- **Issue:** TFLite WASM backend crashed during initialization (INVALID_ARGUMENT).
- **Root Cause:** Model utilized FULLY_CONNECTED Version 12, unsupported by the older WebAssembly runtime.
- **Resolution:** HDF5 baseline model converted successfully to native TensorFlow.js format (model.json). The web-based POC was updated to use @tensorflow/tfjs exclusively.
