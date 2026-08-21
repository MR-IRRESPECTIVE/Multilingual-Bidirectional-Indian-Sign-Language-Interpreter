# Old Project Migration Analysis

## 1. Executive Summary

An audit of the previous Smart India Hackathon repository (`Bidirectional-Indian-Sign-Language-Translator`) reveals that while the **ISL → Text** (computer vision / machine learning) pipeline in our current project is architecturally superior and should not be rolled back, the **Text → ISL** (NLP) pipeline in the old project contains highly valuable ISL grammar restructuring logic that we should port to our current system.

The old repository's dataset and models are fundamentally incompatible with our new spatiotemporal architecture due to being static, single-frame, and single-hand focused. 

## 2. Old Architecture

**Direction A (ISL → Text):**
- MediaPipe extracts hands frame-by-frame.
- 42 static features (1 hand) are generated using relative pixel coordinates normalized by max distance.
- A **KeyPoint Classifier** (Static Dense Neural Network) classifies the static hand sign for that single frame.
- A separate **Point History Classifier** tracks only the index finger's trajectory over 16 frames to guess dynamic gestures.

**Direction B (Text → ISL):**
- Text is processed by a Python FastAPI backend using `spaCy`.
- The NLP pipeline parses dependencies and restructures English (SVO) into ISL grammar (SOV), filtering out stop-words.
- The gloss is sent to a Node.js frontend which plays `.sigml` files on a 3D digital avatar.

## 3. Current Architecture

**Direction A (ISL → Text):**
- MediaPipe tracks hands continuously.
- `v2-86` schema perfectly encodes both hands (84 relative coords) + presence flags (2 floats).
- A 30-frame sequence (buffer) is sent to FastAPI.
- A **Bidirectional LSTM** (Spatiotemporal) model processes the entire sequence at once, naturally handling complex multi-hand dynamic signs (e.g., "Thank You", "Love").

**Direction B (Text → ISL):**
- Text is directly mapped token-by-token to prerecorded ISL human videos.
- *Currently lacks ISL grammar restructuring.*

## 4. Feature Comparison

| Feature | Old Project | New Project (v2-86) |
| :--- | :--- | :--- |
| **Frames** | 1 frame (Static) + 16 (1 point) | 30 frame sequence |
| **Features/frame** | 42 (Static) | 86 (Dynamic) |
| **Left / Right** | Ignored (processes whatever hand) | Explicitly mapped `[0:42]` and `[42:84]` |
| **Presence flags** | None | Yes (`[84]` and `[85]`) |
| **Coordinates** | Pixel-relative, max-normalized | Float-relative, max-normalized |
| **Temporal processing**| Ad-hoc rules on index finger | Native BiLSTM sequence memory |
| **Missing hand** | Fails or skips | Zero-padded with `0.0` presence |

## 5. Model Comparison

The old model is a simple `Dense(20) -> Dense(10)` neural network trained on flattened static frames. It is extremely fast but incapable of understanding complex signs that require motion paths involving all fingers and both hands.

Our current `Baseline V1` is a `BiLSTM(64) -> Dense(64)` model trained on `30x86` sequences. It represents a massive architectural upgrade in capturing true sign language phonology (movement, hold, orientation).

## 6. Dataset Comparison

The old dataset (`keypoint.csv`) contains ~14,000 rows of static 42-feature flattened arrays. 
Our current dataset contains ~722 sequences of `30x86` arrays.

**Migration Feasibility: NO**
We cannot migrate the old dataset into our current project. A single static frame cannot be safely upsampled into a 30-frame sequential motion path without destroying the temporal integrity of the BiLSTM training data. Furthermore, the old dataset lacks multi-hand distinction and presence flags.

## 7. Text → ISL Comparison

The old project uses a digital 3D avatar parsing SiGML files. While SiGML allows for endless generative combinations, the resulting animations are heavily robotic and lack facial expressions (non-manual markers crucial for ISL). 

Our current project maps words to prerecorded human videos. This is much more natural and expressive for Deaf users, but it currently lacks the grammar restructuring that the old project had.

## 8. Reusable Components

| File/Component | Purpose | Why useful | Compatibility | Required changes |
| :--- | :--- | :--- | :--- | :--- |
| `isl_nlp.py` | ISL Grammar NLP | Converts English SVO (Subject-Verb-Object) to ISL SOV (Subject-Object-Verb). | High | Refactor to integrate cleanly into `backend/app/services/text_translation_service.py`. |

## 9. Components NOT Worth Reusing

- **Old Datasets (`keypoint.csv`)**: Incompatible format (static, 1-hand).
- **Old Models (`.hdf5` / `.tflite`)**: Inferior architecture.
- **Node.js Web UI / Avatar**: The Next.js stack with prerecorded videos is vastly superior for UX and natural expression.
- **Old Feature Extraction**: `v2-86` is already an evolution of the old normalization technique, extended to support sequences and two hands.

## 10. V2 Recommendations

Based on this audit, to improve our current project for "Baseline V2", we should:

1. **Keep the ISL → Text Pipeline Exactly As Is**: Do not change the `30x86` or BiLSTM architecture. It is already the correct approach. Focus only on capturing more training data to fix the overfitting issues.
2. **Port the NLP Logic**: We MUST migrate the `spaCy`-based dependency parsing from the old project's `isl_nlp.py` into our current `TextTranslationService`. This will immediately elevate our Direction B pipeline from a "dumb word-mapper" to a true grammatical translator.
