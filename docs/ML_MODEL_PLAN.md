# ML Model Plan
## Inherited Model Verification

### Model 1: Repo 1 Feedforward NN
- **Model Type:** FNN (Keras .h5)
- **Input:** 42 features (21 landmarks * 2 (x,y))
- **Output:** ~35 classes (alphabets/numbers)
- **Model Format:** HDF5 (.h5)
- **Verified Accuracy:** INDEPENDENT ACCURACY NOT YET VERIFIED.

### Model 2: Repo 3 TFLite Models
- **Model Type:** Multi-Layer Perceptron (KeyPoint)
- **Input:** Normalized MediaPipe coordinates
- **Output:** 41 classes
- **Training Data:** Custom recorded CSV
- **Classes:** 10 words + alphabets + null
- **Model Format:** TFLite (.tflite)
- **Verified Accuracy:** INDEPENDENT ACCURACY NOT YET VERIFIED.

## 1. Vision / ISL Recognition Model

**Objective:** Translate video of a user signing into discrete English words (gloss).

**Selected Pipeline (Updated Phase 3 Design):**
- **Feature Extraction:** MediaPipe Hands (running locally in the browser).
- **Preprocessing:** Origin-shift normalization, flattening into a 42-feature array per hand.
- **Temporal Window:** A rolling buffer of 30 frames (~1 second) is maintained.
- **Classifier:** 1D Convolutional Neural Network (1D CNN) executing in browser via native TensorFlow.js.
- **Why a Temporal Model (1D CNN)?** Phase 3 ISL linguistic research proved that 8 out of 10 of our MVP signs (Hello, Sorry, Eat, etc.) are *dynamic* and require temporal trajectory tracking. A static MLP on a single frame cannot distinguish them. 1D CNNs process fixed sequences much faster than LSTMs in the browser.

## 2. Text to ISL Model
- **MVP:** Rule-based NLP mapping (SpaCy) to map English/Hindi to SOV grammar. No deep generative video model used for MVP to ensure reliability and speed.

## 3. Improved Model (Future Phase)
- **Model Type:** Spatial-Temporal Graph Convolutional Network (ST-GCN) or LSTM.
- **Input Format:** MediaPipe Holistic (Hands + Pose + Face).
- **Why chosen:** To capture non-manual features (facial expressions) and two-handed dynamic signs more effectively.

## TFJS Conversion
We abandoned the TFLite WASM pipeline in Phase 2B due to an Operator Version Mismatch (FULLY_CONNECTED v12). We converted the baseline HDF5 Keras model to a native TensorFlow.js model using tensorflowjs_converter. This native approach ensures seamless execution in the browser, eliminating WASM layer issues while preserving prediction equivalence.
