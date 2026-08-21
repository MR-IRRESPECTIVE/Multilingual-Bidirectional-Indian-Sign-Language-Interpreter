# ISL→Text Model Benchmark Report
*Generated: 2026-08-21 — Pre-demo audit of all available legacy models*

---

## Executive Summary

**All four reference repositories were cloned, all model files loaded and inspected, all datasets analysed. No legacy model covers the target vocabulary needed for tomorrow's demonstration. The recommendation is at the bottom of this document.**

---

## Quick Comparison Table

| Model | Input | Classes | Key Vocabulary | Runnable? | Integration |
|---|---|---|---|---|---|
| **Baseline V1 BiLSTM** | 30 × 86 | 10 ISL words | Hello, Yes, No, Good, Thank You, Eat, Namaste, Indian, Love, Sorry | ✅ Already live | N/A (current) |
| Atharv `(5).keras` | 1 × 42 (static) | 30 | **Hello**, Sorry, Eat/Food, a-z, digits — **No Yes/No/Good/ThankYou** | ✅ Yes | HARD |
| Atharv `hdf5` | 1 × 42 (static) | 3 | Unknown 3 classes | ✅ Yes | NOT WORTH IT |
| Maitree `model.h5` | 1 × 42 (static) | 35 | **Only A, B, C trained** | ✅ Yes | NOT WORTH IT |
| SIH (kamal-stark) | Image | none | None — No model file | ❌ No model | NOT WORTH IT |
| Dhadwal SqueezeNet | 224×224 image | 10 | **Letters only: G,I,K,O,P,S,U,V,X,Y** | ❌ YOLO weights missing | NOT WORTH IT |

---

## Model 1: Baseline V1 (Our Current Model)

**File:** `backend/models/archive/baseline_v1/model.keras`
- **Input:** `30 × 86` (BiLSTM sequence)
- **Output:** 10 classes
- **Vocabulary:** Hello, Yes, No, Good, Thank You, Eat/Food, Love, Namaste, Indian, Sorry
- **Architecture:** Bidirectional LSTM(64) → Dense(64) → Softmax(10)
- **Live performance:** Poor (~20–40% confidence). Usually returns "Unknown" (threshold=0.70).
- **Root cause:** Insufficient training data, single-signer training, overfitting.

---

## Model 2: Atharv's Keypoint Classifier — `keypoint_classifier (5).keras`

**Repo:** `atharvsp189/Bidirectional-Indian-Sign-Language-Translator`  
**File:** `scratch/reference/Bidirectional-Indian-Sign-Language-Translator/Indian-Sign-Language-to-Text/model/keypoint_classifier/keypoint_classifier (5).keras`

### Architecture (confirmed by loading model)
```
Dropout(0.2) → Dense(512, ReLU) → Dropout(0.4) → Dense(512, ReLU) → Dense(30, Softmax)
Params: 300,062 trainable
Input shape: (None, 42)
Output shape: (None, 30)
```

### Feature Representation
- **Hands:** Single hand only
- **Landmarks:** 21 × XY only (Z discarded)
- **Feature dim:** 42 (flattened)
- **Normalisation:** Wrist-relative centering + max-abs scaling to \[-1, 1\]
- **Type:** Static, single-frame (no temporal information)

### Dataset (included in repo)
| CSV | Rows | Feature cols | Classes |
|---|---|---|---|
| `keypoint.csv` | 14,090 | 42 | 6 (classes 4,5,6,7,8,9) |
| `keypoint_3.csv` | 8,026 | 42 | 4 (classes 0,1,2,3) |

**The full training dataset for all 30 classes is NOT included.** Only a partial subset is present.

### Class Coverage — CRITICAL FINDING

The model has **30 output neurons**, but the label CSV has 41 labels. Labels 30–40 are **NOT covered by this model**:

| Model idx | Label | In model? |
|---|---|---|
| 8 | **hello** | ✅ YES |
| 9 | **sorry** | ✅ YES |
| 29 | **eat/food** | ✅ YES |
| — | **yes** | ❌ NO (label idx 39, outside model) |
| — | **no** | ❌ NO (label idx 38, outside model) |
| — | **good** | ❌ NO (label idx 37, outside model) |
| — | **thank you** | ❌ NO (label idx 33, outside model) |
| — | **love** | ❌ NO (label idx 34, outside model) |
| — | **namaste** | ❌ NO (label idx 32, outside model) |
| — | **indian** | ❌ NO (label idx 30, outside model) |

**Only 3 out of our 10 target signs are present: hello, sorry, eat/food.**

### TFLite Versions
- `keypoint_classifier.tflite` and `(5).tflite`: **Incompatible op version** (`FULLY_CONNECTED v12`). Cannot load with our TF version.
- `keypoint_classifier_2.tflite`: Loads but outputs only 3 classes. Useless.

### Other Model in Repo
- `keypoint_classifier_0.hdf5`: `Dense(20) → Dense(10) → Dense(3)`. Only 3 output classes. An early scratch model, useless.

### Integration Rating: **HARD / NOT WORTH IT**
This model would require a separate MediaPipe pipeline (single-hand, 42 features), a separate inference service, AND it only covers 3 of our 10 target signs.

---

## Model 3: Maitree's ANN — `model.h5`

**Repo:** `MaitreeVaria/Indian-Sign-Language-Detection`  
**File:** `scratch/reference/Indian-Sign-Language-Detection/model.h5`

### Architecture (confirmed)
```
Dense(1024) → Dense(632) → Dense(328) → Dense(152) → Dense(35, Softmax)
Params: 954,821
Input: (None, 42)   Output: (None, 35)
```

### Vocabulary
- 35 classes: digits 1–9 and letters A–Z
- **No ISL words at all**

### Dataset
- `keypoint.csv`: 7,669 rows
- Only 3 classes present: **A (4264), B (2206), C (1199)**
- The other 32 output neurons have **no training data** — model will produce random output for any sign except A, B, C
- 1,866 exact duplicate rows

### Integration Rating: **NOT WORTH IT**
No ISL words. 32 of 35 classes untrained. Zero value for demo.

---

## Model 4: SIH Repository — No Trained Model

**Repo:** `kamal-stark-dev/Indian-Sign-Language-Translation-SIH`

### Findings
- `Prototype/HandSignDetection/test.py` uses `cvzone` + a Teachable Machine model via `ClassificationModule`
- **The model file is commented out** — hardcoded path to developer's local machine
- `Prototype/HandSignDetection/Signs/` contains only 3 image folders: A, B, C
- **No `.h5`, `.tflite`, `.keras`, `.pb` or any model file exists in the repository**

### Integration Rating: **NOT WORTH IT** — nothing to integrate

---

## Model 5: Abhishek Dhadwal SqueezeNet

**Repo:** `AbhishekSinghDhadwal/Indian-Sign-Language-Translator`  
**File:** `scratch/reference/Indian-Sign-Language-Translator/App/final_model` (~3.1 MB, no extension)

### Architecture
- SqueezeNet CNN trained via transfer learning
- Input: `224 × 224 × 3` RGB image (after YOLO crop + skin segmentation)
- Output: 10 classes

### Class Labels (from `model_class.json`)
```
0: G,  1: I,  2: K,  3: O,  4: P,  5: S,  6: U,  7: V,  8: X,  9: Y
```
**All 10 classes are alphabet letters — zero ISL words.**

### Pipeline Requirements
1. Face detection (Haar cascade) — activation trigger
2. Record a 7-second video clip
3. Extract random 20% of frames
4. **YOLO-v3 hand detection** → crop bounding box
5. Resize to 224×224
6. **Skin segmentation** (HSV + YCbCr watershed filter)
7. SqueezeNet inference

**Critical blocker:** `yolo_models/cross-hands.weights` file is **NOT in the repository** (replaced by a text file saying "Download and place here"). Without it, the pipeline cannot detect hands, and therefore cannot produce any input for the CNN.

### Integration Rating: **NOT WORTH IT**
- Requires YOLO weights download (separate large file, ~200MB estimated)
- 7-second recording pipeline is incompatible with real-time webcam streaming
- Recognises only G, I, K, O, P, S, U, V, X, Y — no ISL words at all
- Skin segmentation is fragile to lighting variations

---

## Phase 5 Summary: Can Any Legacy Model Be Tested Live?

| Model | Runnable Tomorrow? | Reason |
|---|---|---|
| Atharv `(5).keras` | Conditionally | Needs separate 42-feature pipeline. Covers hello/sorry/eat only. |
| Maitree `model.h5` | Yes but useless | Only A, B, C reliably trained |
| SIH | No | No model file |
| Dhadwal SqueezeNet | No | YOLO weights missing |

---

## Option A: Keep Baseline V1

**Our current BiLSTM (`30 × 86`) is the only model that covers all 10 target ISL words.**

The problem is NOT the model architecture. The problem is:
1. **Insufficient training data** — small dataset, few signers
2. **Overfitting** — high training accuracy, poor generalisation
3. **Threshold** — 0.70 is conservative for a baseline model

**What this means for tomorrow's demo:**
The BiLSTM will produce output. The issue is confidence. During live testing the confidence was reported as 20–40%. The threshold (0.70) filters these out as "Unknown". Lowering to **0.45–0.50** would likely surface predictions — whether those predictions are accurate is the real question and depends entirely on how well the signer matches the training data.

## Option B: Replace with Legacy Model

**Not feasible.** No legacy model covers our vocabulary.

## Option C: Hybrid

**Not feasible for tomorrow.** The only viable hybrid addition (Atharv's `.keras`) requires:
- A separate 42-feature MediaPipe extraction path (not in current frontend)
- Only covers 3/10 signs
- Integration would take hours with unproven reliability

---

## Option D: Emergency Retraining (Recommended Addendum)

Our existing pipeline is fully wired. The entire `30×86 → BiLSTM → prediction` chain works correctly end-to-end. The model is simply underfit due to limited data.

**A focused 30–60 minute data collection session right now, followed by a 10-minute retrain, is the highest-value action before tomorrow's demo.** This is within our existing tooling (`collection` page → `ml/prepare_training_dataset.py` → training script).

---

## Final Recommendation

> **A — KEEP BASELINE V1. DO NOT INTEGRATE ANY LEGACY MODEL.**
>
> No legacy model covers the target ISL vocabulary. The Atharv `(5).keras` is the closest but still misses yes, no, good, thank you, love, namaste, and indian — seven of our ten signs.
>
> The correct action for tomorrow is **not to switch models** but to **address Baseline V1's real weakness: data volume**. Even 5–10 additional samples per sign from the demo signer, collected and retrained tonight, would substantially improve live accuracy for that specific signer.
>
> If retraining is not feasible, temporarily lower the confidence threshold from `0.70` to `0.50` in `recognition_service.py` and document clearly that Baseline V1 is an early prototype shown for engineering validation, not production accuracy.
