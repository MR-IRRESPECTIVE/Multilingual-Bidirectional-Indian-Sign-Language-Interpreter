# Static Model V1 Report

*Generated: 2026-08-21*

---

## 1. Source Datasets

| Dataset | Source Repo | Rows | Features | Classes Used |
|---|---|---|---|---|
| `keypoint.csv` | atharvsp189/Bidirectional-Indian-Sign-Language-Translator | 14,090 | 42 | digit_4, digit_7, digit_8, digit_9, hello, sorry |
| `keypoint_3.csv` | atharvsp189/Bidirectional-Indian-Sign-Language-Translator | 8,026 | 42 | digit_0, digit_1, digit_2, digit_3 |
| `keypoint.csv` | MaitreeVaria/Indian-Sign-Language-Detection | 7,669 | 42 | A, B, C |

---

## 2. Preprocessing Compatibility

**VERIFIED IDENTICAL** across both repos:

| Property | Value |
|---|---|
| Landmark source | MediaPipe Hands (21 landmarks) |
| Coordinates | XY only (Z discarded) |
| Centering | Wrist (landmark 0) subtracted from all points |
| Normalization | Max-abs scaling to [-1, 1] |
| Flattening | Row-major: [x0, y0, x1, y1, ..., x20, y20] = 42 features |
| Handedness | Hand-agnostic (processes whatever hand is detected) |

Mathematical verification: 1,000 random synthetic tests, max diff = 0.00e+00.

---

## 3. Merged Dataset

| Metric | Value |
|---|---|
| Total rows before dedup | 29,785 |
| Exact duplicate rows removed | 1,866 |
| **Total rows after dedup** | **27,919** |
| Feature dimension | 42 |
| NaN / Inf values | 0 |

### Samples Per Class

| Class ID | Label | Samples | Source |
|---|---|---|---|
| 0 | digit_0 | 2,102 | Atharv kp3 |
| 1 | digit_1 | 1,923 | Atharv kp3 |
| 2 | digit_2 | 2,152 | Atharv kp3 |
| 3 | digit_3 | 1,849 | Atharv kp3 |
| 4 | digit_4 | 2,402 | Atharv kp |
| 5 | digit_7 | 2,121 | Atharv kp |
| 6 | digit_8 | 3,164 | Atharv kp |
| 7 | digit_9 | 1,814 | Atharv kp |
| 8 | hello | 2,426 | Atharv kp |
| 9 | sorry | 2,163 | Atharv kp |
| 10 | A | 2,398 | Maitree (after dedup) |
| 11 | B | 2,206 | Maitree |
| 12 | C | 1,199 | Maitree (after dedup) |

---

## 4. Architecture

```
Input(42) -> BatchNormalization -> Dense(128, ReLU) -> Dropout(0.3)
          -> Dense(64, ReLU) -> Dropout(0.3) -> Dense(13, Softmax)
```

| Property | Value |
|---|---|
| Total parameters | ~14,669 |
| Optimizer | Adam (lr=1e-3, reduced on plateau) |
| Loss | Sparse categorical cross-entropy |
| Class weighting | Balanced (sklearn compute_class_weight) |
| Early stopping | patience=10 on val_accuracy, restore best weights |

---

## 5. Training Metrics

| Metric | Value |
|---|---|
| Training samples | 19,543 |
| Validation samples | 4,188 |
| Test samples | 4,188 |
| Epochs trained | 45 (early stop at best=35) |
| **Test accuracy** | **99.8%** |
| Test loss | 0.0065 |

---

## 6. Per-Class Performance (Test Set)

| Class | Precision | Recall | F1 | Support |
|---|---|---|---|---|
| digit_0 | 1.000 | 0.994 | 0.997 | 315 |
| digit_1 | 1.000 | 0.997 | 0.998 | 288 |
| digit_2 | 1.000 | 1.000 | 1.000 | 323 |
| digit_3 | 1.000 | 1.000 | 1.000 | 277 |
| digit_4 | 0.994 | 1.000 | 0.997 | 360 |
| digit_7 | 1.000 | 1.000 | 1.000 | 318 |
| digit_8 | 0.988 | 1.000 | 0.994 | 475 |
| digit_9 | 1.000 | 0.978 | 0.989 | 272 |
| hello | 1.000 | 1.000 | 1.000 | 364 |
| sorry | 1.000 | 1.000 | 1.000 | 325 |
| A | 1.000 | 1.000 | 1.000 | 360 |
| B | 0.997 | 1.000 | 0.999 | 331 |
| C | 1.000 | 1.000 | 1.000 | 180 |

### Confusion Matrix

Only 9 misclassifications out of 4,188 test samples:
- 2 digit_0 misclassified (as digit_4 and B)
- 1 digit_1 misclassified (as digit_4)
- 6 digit_9 misclassified (as digit_8)

---

## 7. Saved Artifacts

| File | Path |
|---|---|
| Model | [`backend/models/archive/static_v1/model.keras`](file:///c:/Rohan/Multilingual%20Bidirectional%20Indian%20Sign%20Language%20Interprete/backend/models/archive/static_v1/model.keras) |
| Label Map | [`backend/models/archive/static_v1/label_map.json`](file:///c:/Rohan/Multilingual%20Bidirectional%20Indian%20Sign%20Language%20Interprete/backend/models/archive/static_v1/label_map.json) |
| Metadata | [`backend/models/archive/static_v1/metadata.json`](file:///c:/Rohan/Multilingual%20Bidirectional%20Indian%20Sign%20Language%20Interprete/backend/models/archive/static_v1/metadata.json) |
| Training Data | [`datasets/static_training/static_dataset.csv`](file:///c:/Rohan/Multilingual%20Bidirectional%20Indian%20Sign%20Language%20Interprete/datasets/static_training/static_dataset.csv) |
| Manifest | [`datasets/static_training/manifest.json`](file:///c:/Rohan/Multilingual%20Bidirectional%20Indian%20Sign%20Language%20Interprete/datasets/static_training/manifest.json) |

---

## 8. API Endpoint

```
POST /api/translate/sign/static
Content-Type: application/json

{
  "features": [42 float values]
}

Response:
{
  "success": true,
  "prediction": {
    "sign_id": "hello",
    "label": "hello",
    "confidence": 0.99
  },
  "model": {
    "version": "static_v1",
    "feature_generation": "42-landmark-xy-wrist-normalized"
  }
}
```

Confidence threshold: 0.60 (configurable via `STATIC_MODEL_CONFIDENCE_THRESHOLD` env var).

---

## 9. Known Limitations

> [!WARNING]
> **Signer split is RANDOM.** Legacy datasets do not contain signer IDs. The 99.8% test accuracy measures in-distribution performance, not signer generalization. Live accuracy on unseen signers will likely be lower.

> [!IMPORTANT]
> **Live webcam testing is NOT yet done.** The 99.8% accuracy is on held-out data from the same dataset. Actual camera performance must be verified through Phase 6 live testing.

- Only 13 classes (8 digits, 2 ISL words, 3 letters)
- Single-hand gestures only
- Static signs only (no temporal/dynamic signs)
- Missing digits: 5, 6 (no data in any source)
- Missing letters: D-Z (no committed training data)
- Training data from unknown number of signers
- Class C has fewest samples (1,199) - potential weakness

---

## 10. Dual Model Architecture

Both models are now independently deployable:

| Model | Endpoint | Input | Classes | Status |
|---|---|---|---|---|
| BiLSTM (baseline_v1) | `POST /api/translate/sign` | 30 x 86 frames | 10 ISL words | Existing, untouched |
| Static ANN (static_v1) | `POST /api/translate/sign/static` | 42 features | 13 static signs | NEW |

**Baseline V1 is completely untouched.** The static model runs as a parallel independent service.

---

## 11. Test Results

- Backend tests: **65/65 passed**
- ML tests: **8/8 passed**
- Frontend build: **SUCCESS**
