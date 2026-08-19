# 41-Class Model Reconstruction Audit

## 1. Executive Summary

The 41-class `keypoint_classifier.tflite` model **CANNOT be reproduced** from the available repository evidence. The repository contains a training notebook that was last executed with `NUM_CLASSES = 3`, producing a 3-class model. The 41-class TFLite model was generated from a training run that is **not preserved** in the repository—neither the corresponding HDF5/Keras checkpoint, the matching dataset, nor the notebook state that produced it are available. The dataset (`keypoint.csv`) contains only **6 unique class IDs** (classes 4-9), not 41. The label file (`keypoint_classifier_label.csv`) lists 41 labels, but the training data to populate all 41 classes does not exist in the repository.

**Reproducibility Classification: C — NOT REPRODUCIBLE FROM AVAILABLE EVIDENCE**

---

## 2. Artifact Inventory

All files in `Indian-Sign-Language-to-Text/model/keypoint_classifier/`:

| File | Size | Description |
|------|------|-------------|
| `keypoint_classifier.tflite` | 323,856 bytes | **41-class** TFLite model (FULLY_CONNECTED v12, SOFTMAX v1) |
| `keypoint_classifier (5).keras` | 3,625,634 bytes | **30-class** Keras 3 model (Input→Dropout(0.2)→Dense(512)→Dropout(0.4)→Dense(512)→Dense(30,softmax)) |
| `keypoint_classifier (5).tflite` | 318,072 bytes | **30-class** TFLite model |
| `keypoint_classifier_0.hdf5` | 22,264 bytes | **3-class** HDF5 model (Input→Dropout(0.2)→Dense(20)→Dropout(0.4)→Dense(10)→Dense(3,softmax)) |
| `keypoint_classifier_2.tflite` | 6,224 bytes | **3-class** TFLite model (FULLY_CONNECTED v3) |
| `keypoint.csv` | 10,621,163 bytes | Training data: 14,090 samples, **6 unique classes** (4,5,6,7,8,9) |
| `keypoint_3.csv` | 6,108,353 bytes | Training data: 8,026 samples, **4 unique classes** (0,1,2,3) |
| `keypoint_classifier_label.csv` | 191 bytes | Label map: **41 entries** (0-9, hello, sorry, a-z subset, words) |
| `keypoint_classifier.py` | 1,308 bytes | TFLite inference wrapper script |

---

## 3. 3-Class HDF5 Findings

- **File:** `keypoint_classifier_0.hdf5` (22,264 bytes)
- **Architecture [VERIFIED]:**
  - Input: (42,) — 21 landmarks × 2 coordinates
  - Dropout(0.2)
  - Dense(20, relu)
  - Dropout(0.4)
  - Dense(10, relu)
  - Dense(3, softmax)
- **Total params [VERIFIED]:** 1,103
- **Framework [VERIFIED]:** Keras 2.x (old HDF5 format)
- **Matches notebook code [VERIFIED]:** The notebook code cell sets `NUM_CLASSES = 3` and the model summary output shows `dense_2 (Dense) → (None, 3) → 33 params`
- **Matches `keypoint_classifier_2.tflite` [VERIFIED]:** The small 6,224-byte TFLite file has output shape `[1, 3]` with FULLY_CONNECTED v3, consistent with an older TF 2.x conversion of the 3-class HDF5

---

## 4. 41-Class TFLite Findings

- **File:** `keypoint_classifier.tflite` (323,856 bytes)
- **Schema version [VERIFIED]:** 3
- **Input shape [VERIFIED]:** `[1, 42]` (float32)
- **Output shape [VERIFIED]:** `[1, 41]` (float32)
- **Operators [VERIFIED]:**
  - FULLY_CONNECTED version 12
  - SOFTMAX version 1
- **Quantization [VERIFIED]:** Dynamic range (weights int8, activations float32)
- **Hidden layer architecture [UNKNOWN]:** The TFLite binary only proves FULLY_CONNECTED and SOFTMAX operators are present. The exact number of hidden layers, their sizes, and dropout rates **cannot be determined** from the TFLite flatbuffer alone.
- **Source checkpoint [UNKNOWN]:** No HDF5 or Keras file with 41 output classes exists in the repository.
- **Training data [UNKNOWN]:** No CSV with 41 unique class IDs exists in the repository.

---

## 5. Training Notebook Findings

**File:** `Notebooks/keypoint_classification.ipynb`

| Parameter | Value | Status |
|-----------|-------|--------|
| Dataset path | `model/keypoint_classifier/keypoint.csv` | **VERIFIED** |
| Model save path | `model/keypoint_classifier/keypoint_classifier.hdf5` | **VERIFIED** |
| NUM_CLASSES | `3` | **VERIFIED** (hardcoded in cell 3) |
| Input features | 42 (21 landmarks × 2 coords) | **VERIFIED** |
| Architecture | Sequential: Input(42)→Dropout(0.2)→Dense(20,relu)→Dropout(0.4)→Dense(10,relu)→Dense(NUM_CLASSES,softmax) | **VERIFIED** |
| Optimizer | `adam` | **VERIFIED** |
| Loss | `sparse_categorical_crossentropy` | **VERIFIED** |
| Metrics | `accuracy` | **VERIFIED** |
| Max epochs | 1000 | **VERIFIED** |
| Early stopping patience | 20 | **VERIFIED** |
| Batch size | 128 (inferred from 27 batches × 128 ≈ 3,456 train samples) | **INFERRED** |
| Train/test split | 75/25, random_state=42 | **VERIFIED** |
| RANDOM_SEED | 42 | **VERIFIED** |
| TFLite conversion | `tf.lite.Optimize.DEFAULT` | **VERIFIED** |
| TFLite output path | `model/keypoint_classifier/keypoint_classifier.tflite` | **VERIFIED** |
| Python version | 3.8.5 | **VERIFIED** (from notebook metadata) |
| TF env path | `d:\00.envs\20201208_mediapipe\` | **VERIFIED** (from warning output) |
| TF version | ~2.4 (inferred from env name "20201208" and deprecation warnings) | **INFERRED** |

### Critical Finding
The notebook was **last executed with NUM_CLASSES = 3**. The output cells show:
- Model summary: `dense_2 (Dense) → (None, 3) → 33 params`
- Classification report: 3 classes (0, 1, 2)
- TFLite test output: `[0.7729778  0.16973573 0.05728643]` (3 probabilities)

The notebook would need `NUM_CLASSES = 41` and a much larger dataset to produce the 41-class model. The notebook was **not re-executed** with those parameters before being committed.

---

## 6. Dataset Findings

### `keypoint.csv` (the "main" dataset referenced in the notebook)
- **Total samples [VERIFIED]:** 14,090
- **Unique class IDs [VERIFIED]:** 6 (classes 4, 5, 6, 7, 8, 9)
- **Format [VERIFIED]:** CSV with 43 columns (class_id + 42 landmark features)
- **Licensing [UNKNOWN]:** No license file accompanies the dataset. It was collected by the authors using MediaPipe + keyboard logging in `app.py`.

### `keypoint_3.csv` (alternative/earlier dataset)
- **Total samples [VERIFIED]:** 8,026
- **Unique class IDs [VERIFIED]:** 4 (classes 0, 1, 2, 3)
- **Note:** This dataset name suggests it corresponds to a 3 or 4-class experiment. The suffix `_3` correlates with the `_0.hdf5` and `_2.tflite` naming pattern.

### Key Observation
Neither CSV contains anywhere near 41 unique class IDs. Combined, they cover classes 0-9 only (10 unique classes). **No dataset with 41 classes exists in the repository.**

---

## 7. Architecture Reconstruction

### What we know about the 41-class model

| Fact | Source | Status |
|------|--------|--------|
| Input: [1, 42] | TFLite inspection | **VERIFIED** |
| Output: [1, 41] | TFLite inspection | **VERIFIED** |
| Uses FULLY_CONNECTED | TFLite inspection | **VERIFIED** |
| Uses SOFTMAX | TFLite inspection | **VERIFIED** |
| Uses `tf.lite.Optimize.DEFAULT` | TFLite op version 12 + notebook code | **VERIFIED** |
| Hidden layer sizes | — | **UNKNOWN** |
| Number of hidden layers | — | **UNKNOWN** |
| Dropout rates | — | **UNKNOWN** |

### Three candidate architectures exist in the repo

| Model | Architecture | Output Classes |
|-------|-------------|----------------|
| HDF5 (3-class) | Input(42)→Dropout(0.2)→Dense(20)→Dropout(0.4)→Dense(10)→Dense(3) | 3 |
| .keras (30-class) | Input(42)→Dropout(0.2)→Dense(512)→Dropout(0.4)→Dense(512)→Dense(30) | 30 |
| TFLite (41-class) | Input(42)→???→Dense(41) | 41 |

The 3-class and 30-class architectures are **confirmed different** from each other. The notebook documents the 3-class architecture. The `.keras` file reveals a **much larger** 512-unit architecture. The 41-class model's file size (323,856 bytes) is close to the 30-class model's size (318,072 bytes), suggesting the 41-class model **likely uses the same 512-unit architecture** as the `.keras` file but with Dense(41) instead of Dense(30) as the final layer.

**Architecture of 41-class model [INFERRED, NOT VERIFIED]:**
Input(42) → Dropout(0.2) → Dense(512, relu) → Dropout(0.4) → Dense(512, relu) → Dense(41, softmax)

This is an **inference** based on file size similarity, not a verified fact.

---

## 8. Preprocessing Reconstruction

The preprocessing pipeline is fully documented in both `app.py` and the notebook:

1. MediaPipe Hands detects 21 hand landmarks
2. Landmark pixel coordinates are extracted relative to image dimensions
3. Coordinates are made relative to landmark 0 (wrist)
4. The 42 values (21 × 2) are normalized by dividing by the maximum absolute value
5. The resulting float32 vector is fed to the model

**Status: VERIFIED** — The preprocessing code is complete and unambiguous.

---

## 9. TFLite Conversion Reconstruction

The notebook shows the exact conversion code:
```python
converter = tf.lite.TFLiteConverter.from_keras_model(model)
converter.optimizations = [tf.lite.Optimize.DEFAULT]
tflite_quantized_model = converter.convert()
open(tflite_save_path, 'wb').write(tflite_quantized_model)
```

**Status: VERIFIED** — The conversion method is documented.

---

## 10. Licensing Analysis

| Component | License | Reuse Status |
|-----------|---------|--------------|
| Repository code (`app.py`, classifiers, utils) | **NOT FOUND** | **UNKNOWN** — Cannot reuse without explicit permission |
| Training notebook | **NOT FOUND** | **UNKNOWN** — Can study methodology (REUSE REQUIRES ATTRIBUTION) |
| Dataset (`keypoint.csv`, `keypoint_3.csv`) | **NOT FOUND** | **UNKNOWN** — Self-collected by authors, no license |
| Pre-trained models (`.tflite`, `.hdf5`, `.keras`) | **NOT FOUND** | **UNKNOWN** — Cannot reuse without explicit permission |
| Label file | **NOT FOUND** | **UNKNOWN** — Label names themselves (ISL vocabulary) are factual |
| MediaPipe (dependency) | Apache 2.0 | **CLEARLY PERMITTED** |
| TensorFlow/Keras (dependency) | Apache 2.0 | **CLEARLY PERMITTED** |

**No LICENSE file exists in the repository root or any subdirectory.**

---

## 11. Verified Facts

1. The repository contains **three different model generations**: 3-class (HDF5 + TFLite v3), 30-class (.keras + TFLite v12), and 41-class (TFLite v12 only)
2. The training notebook was last executed with `NUM_CLASSES = 3`
3. The 41-class TFLite model has input `[1,42]` and output `[1,41]`
4. The dataset `keypoint.csv` contains only 6 unique classes (4-9)
5. The label file `keypoint_classifier_label.csv` lists exactly 41 labels
6. The preprocessing pipeline is fully documented
7. The TFLite conversion method (`Optimize.DEFAULT`) is documented
8. All model files were added in a single commit (`aba386f`) on Jan 4, 2026
9. The `.keras` file uses Keras 3 format (zip archive), indicating a newer TF version than the notebook's Python 3.8.5 environment
10. The inference code in `keypoint_classifier.py` applies a threshold of 0.5 and has index remapping logic (`if result_index > 30: return result_index - 1`)

---

## 12. Inferences

1. The 41-class model was trained in a session not captured by the notebook or committed datasets
2. The 41-class model likely uses the same Dense(512)→Dense(512) architecture as the 30-class `.keras` model, based on similar file sizes (~320KB)
3. The training data for the 41-class model was collected incrementally using the `logging_csv` function in `app.py`, which appends landmarks to `keypoint.csv` when in keyboard logging mode
4. The committed `keypoint.csv` represents only a partial/intermediate snapshot of the data collection, not the full 41-class dataset
5. The author(s) likely trained incrementally: first 3 classes, then expanded to 30, then to 41

---

## 13. Unknowns

1. **41-class training dataset** — Does not exist in the repository
2. **41-class Keras/HDF5 checkpoint** — Does not exist in the repository
3. **Exact hidden layer architecture of the 41-class model** — Cannot be verified from TFLite alone
4. **Training hyperparameters used for the 41-class run** — Not documented
5. **Number of training epochs achieved** — Not documented
6. **Final accuracy of the 41-class model** — Not documented
7. **Which TensorFlow version produced the 41-class TFLite** — UNKNOWN (FULLY_CONNECTED v12 suggests TF ≥ 2.14)
8. **Whether the author used the same notebook or a different script** — UNKNOWN
9. **How many samples per class were collected for all 41 classes** — UNKNOWN
10. **Whether data augmentation was used** — UNKNOWN

---

## 14. Reproducibility Classification

### **C — NOT REPRODUCIBLE FROM AVAILABLE EVIDENCE**

**Reasons:**
1. The training dataset for the 41-class model does not exist in the repository (only 6 of 41 classes have data)
2. No Keras/HDF5 source checkpoint for the 41-class model exists
3. The exact architecture cannot be verified (only inferred from file size comparison)
4. The training hyperparameters for the 41-class run are not documented
5. Even if we replicated the architecture and training pipeline, without the original 41-class dataset, we would produce a different model with different weights

---

## 15. Recommended Next Steps

### Path A: Train Our Own 41-Class Model From Scratch
- Use the **verified architecture template** from the notebook (Input→Dropout→Dense→Dropout→Dense→Dense)
- Use the **verified preprocessing pipeline** from `app.py`
- Use the **41 label definitions** from `keypoint_classifier_label.csv` as our vocabulary
- Collect our **own training data** using the same MediaPipe + CSV logging approach
- Train with the same hyperparameters (adam, sparse_categorical_crossentropy)
- Convert to native TFJS (not TFLite) to avoid the browser runtime issues
- **Advantages:** Clean licensing, full control, verified pipeline
- **Disadvantages:** Requires significant data collection effort (hundreds of samples per class)

### Path B: Use the Existing 41-Class TFLite As-Is
- Find a way to run the existing TFLite model in the browser (e.g., compile a newer WASM runtime)
- **Advantages:** No retraining needed
- **Disadvantages:** Licensing unclear, WASM compilation complex, no source checkpoint for debugging

### Path C: Re-convert the 30-Class .keras Model to TFJS
- The `.keras` file is a valid Keras 3 model with 30 classes
- Convert it to native TFJS (it uses standard ops that TFJS supports)
- Expand to 41 classes later by retraining with additional data
- **Advantages:** Has a source checkpoint, known architecture, uses TFJS natively
- **Disadvantages:** Only 30 classes (not 41), licensing still unclear, matching dataset is missing

### Path D: Hybrid — Start with 30-Class .keras + Collect Data for 11 More Classes
- Use Path C as a baseline
- Collect additional training data for the remaining 11 classes
- Fine-tune or retrain to reach 41 classes
- **Advantages:** Faster than full retraining
- **Disadvantages:** Still requires significant data collection, licensing unclear for base model

> [!IMPORTANT]
> **Regardless of path chosen:** We must collect our own training data or obtain a dataset with a clear open-source license. The repository's datasets and models have **NO LICENSE**, and we cannot assume reuse rights.

---

## Comparison Table: HDF5 vs TFLite

| Property | HDF5 (`_0.hdf5`) | TFLite (`.tflite`) |
|----------|-------------------|---------------------|
| File size | 22,264 bytes | 323,856 bytes |
| Format | Keras 2.x HDF5 | TFLite FlatBuffer v3 |
| Input shape | [None, 42] | [1, 42] |
| Output shape | [None, 3] | [1, 41] |
| Output classes | **3** | **41** |
| Architecture | Dense(20)→Dense(10)→Dense(3) | UNKNOWN (inferred: Dense(512)→Dense(512)→Dense(41)) |
| Total params | 1,103 | ~160,000 (estimated) |
| Quantization | None | Dynamic range (Optimize.DEFAULT) |
| Op versions | N/A | FULLY_CONNECTED v12, SOFTMAX v1 |
| Matching dataset | `keypoint_3.csv` (4 classes) | **NONE** |
| Can load in browser | Yes (converted to TFJS) | No (op version mismatch) |
| **Are they the same model?** | **NO** | **NO** |
