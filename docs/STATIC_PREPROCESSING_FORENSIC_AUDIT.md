# Static Preprocessing Forensic Audit

## Executive Summary

The static ISL recognition system achieves 99.8% offline test accuracy but performs poorly on live webcam. This audit traces the exact mathematical pipeline from raw image to 42-feature vector for **both** training and live inference, identifying every discrepancy.

---

## 1. Training Preprocessing Pipeline (Atharv + Maitree)

### Step-by-Step Mathematical Trace

Both source repositories (Atharv and Maitree) use **identical** preprocessing mathematics:

#### Step 1: Horizontal Image Flip
```python
# Atharv (app.py, line 115):
image = cv.flip(image, 1)

# Maitree (dataset_keypoint_generation.py, line 76):
image = cv2.flip(cv2.imread(file), 1)
```

> [!CAUTION]
> **ALL 27,919 training samples were generated from horizontally mirrored images.** This is the single most critical finding. MediaPipe runs on the flipped image, so a physical right hand produces landmarks as if it were a left hand — the entire X-axis is inverted.

#### Step 2: MediaPipe Hand Detection (on flipped image)
```python
results = hands.process(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
```
MediaPipe returns 21 landmarks with `(x, y)` in `[0, 1]` normalized to the **flipped** image dimensions.

#### Step 3: Pixel Space Conversion (`calc_landmark_list`)
```python
landmark_x = min(int(lm.x * image_width), image_width - 1)
landmark_y = min(int(lm.y * image_height), image_height - 1)
```
Converts from `[0, 1]` to integer pixel coordinates.

#### Step 4: Wrist-Relative Centering (`pre_process_landmark`)
```python
base_x, base_y = landmark_point[0][0], landmark_point[0][1]
for i in range(len(temp)):
    temp[i][0] -= base_x
    temp[i][1] -= base_y
```
Landmark 0 (wrist) becomes the origin `(0, 0)`.

#### Step 5: Flatten to 1D
```python
flat = list(itertools.chain.from_iterable(landmark_list))
# Result: [x0, y0, x1, y1, ..., x20, y20] — 42 values
```
Z-coordinates are dropped entirely.

#### Step 6: Max-Absolute Normalization
```python
max_value = max(list(map(abs, flat)))
normalized = [v / max_value for v in flat]
# Result: all values in [-1.0, 1.0]
```

### Source File Locations
| Source | Path | Classes | Image Flip |
|--------|------|---------|------------|
| Atharv `keypoint.csv` | `scratch/reference/Bidirectional-Indian-Sign-Language-Translator/.../keypoint.csv` | digit_4, digit_7, digit_8, digit_9, hello, sorry | **YES** (`cv.flip(image, 1)`) |
| Atharv `keypoint_3.csv` | Same directory, `keypoint_3.csv` | digit_0, digit_1, digit_2, digit_3 | **YES** (`cv.flip(image, 1)`) |
| Maitree `keypoint.csv` | `scratch/reference/Indian-Sign-Language-Detection/keypoint.csv` | A, B, C | **YES** (`cv2.flip(image, 1)`) |

---

## 2. Live Inference Preprocessing Pipeline

### Step-by-Step Mathematical Trace

#### Step 1: Webcam Capture
```
navigator.mediaDevices.getUserMedia() → 640×480 RGB
```
The raw video element is passed to MediaPipe. **No image flip is applied to the pixel data.**

> [!IMPORTANT]
> The `<video>` and `<canvas>` elements use CSS `transform: -scale-x-100` for visual selfie-mirror effect. This is purely cosmetic — MediaPipe receives the **un-flipped** frame.

#### Step 2: MediaPipe Hand Detection (on UN-FLIPPED image)
```typescript
hands.send({ image: videoElement }); // Raw, un-flipped
```

#### Step 3: `processStatic42Features()` (Current Live Path)
```typescript
// Convert to pixel space
const px = Math.min(Math.floor(lm.x * 640), 639);
const py = Math.min(Math.floor(lm.y * 480), 479);

// Wrist centering
rel_x = px - wrist_x;
rel_y = py - wrist_y;

// Flatten and max-abs normalize
// Same math as training
```

#### Step 4: `processStatic42FeaturesFlipped()` (Existing but unused)
```typescript
// SIMULATES cv2.flip(image, 1) by inverting X:
const px = Math.min(Math.floor((1.0 - lm.x) * 640), 639);
// Y unchanged, rest identical
```

---

## 3. The Critical Mismatch

| Property | Training | Live (Current) | Live (Flipped) |
|----------|----------|----------------|-----------------|
| Image Horizontally Flipped Before MediaPipe | **YES** | **NO** | **YES** (simulated) |
| Coordinate System | Flipped X-axis | Raw X-axis | Flipped X-axis |
| Wrist Centering | Yes | Yes | Yes |
| Max-Abs Normalization | Yes | Yes | Yes |
| Feature Dimension | 42 | 42 | 42 |
| **Domain Match** | **BASELINE** | **❌ INVERTED X** | **✅ MATCH** |

### Concrete Example

When a user signs "Hello" with their right hand:

- **Training**: The flipped image makes the right hand appear on the left side → MediaPipe landmarks have specific X-values → model learns this pattern as "hello"
- **Live (current)**: The un-flipped image keeps the right hand on the right side → MediaPipe landmarks have **mirror-image** X-values → model sees a pattern it was never trained on → predicts "digit_7" instead

---

## 4. Dataset Split Analysis

```python
# From train_static_model.py, line 57-64:
X_trainval, X_test = train_test_split(X, y, test_size=0.15, random_state=42, stratify=y)
X_train, X_val = train_test_split(X_trainval, y_trainval, ...)
```

> [!WARNING]
> **The split is purely random row-based.** The metadata confirms: `"signer_split": "random (signer IDs unavailable in legacy datasets)"`. This means:
> - Consecutive frames from the same recording session are split across train and test
> - Highly correlated near-duplicate frames inflate test accuracy
> - The 99.8% accuracy measures memorization of specific recording conditions, NOT generalization

---

## 5. Handedness Analysis

| Property | Training | Live |
|----------|----------|------|
| Hand awareness | None (hand-agnostic) | None |
| MediaPipe handedness used | No — only displayed in UI | Detected but not used for preprocessing |
| Which hand was recorded | Unknown — likely right hand, appearing as left after flip | Any hand user presents |

---

## 6. Class Distribution

| Class ID | Label | Samples | Source |
|----------|-------|---------|--------|
| 0 | digit_0 | 2,102 | Atharv |
| 1 | digit_1 | 1,923 | Atharv |
| 2 | digit_2 | 2,152 | Atharv |
| 3 | digit_3 | 1,849 | Atharv |
| 4 | digit_4 | 2,402 | Atharv |
| 5 | digit_7 | 2,121 | Atharv |
| 6 | digit_8 | 3,164 | Atharv |
| 7 | digit_9 | 1,814 | Atharv |
| 8 | hello | 2,426 | Atharv |
| 9 | sorry | 2,163 | Atharv |
| 10 | A | 2,398 | Maitree |
| 11 | B | 2,206 | Maitree |
| 12 | C | 1,199 | Maitree |

- Imbalance ratio: 2.64× (digit_8 at 3,164 vs C at 1,199)
- C has the fewest samples — this may contribute to C being misclassified as digit_1

---

## 7. Root Cause Summary

### Primary: X-Axis Inversion (Mirroring Mismatch)
The training data was generated on horizontally flipped images. The live pipeline sends un-flipped coordinates. The model has never seen un-flipped hand geometry.

### Secondary: Dataset Leakage
Random row splitting means the test set contains near-duplicate frames from the same recording sessions as training. The 99.8% accuracy is inflated.

### Tertiary: No Cross-Source Validation
Atharv and Maitree data were merged but never tested for cross-source generalization. The model may have memorized source-specific biases (e.g., specific camera angle, hand size, background lighting of each individual recorder).

### Quaternary: No Handedness Control
Training was done on flipped images of (likely) right hands, which appear as left hands. The model has no mechanism to handle actual left-hand users or the orientation difference.
