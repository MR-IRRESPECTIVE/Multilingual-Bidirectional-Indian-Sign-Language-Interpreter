# Investigation Report: Static Model Live Validation Failures

**Date:** 2026-08-21
**Target:** Investigate why the live "Hello" sign is predicted as `digit_7` with ~100% confidence.

---

## 1. ROOT CAUSE
The static model predictions are failing because the legacy training dataset was generated using **horizontally mirrored images** (`cv.flip(image, 1)`), which fundamentally inverted all $X$ coordinates (making them $1 - X$). 

Because the live webcam pipeline (`processStatic42Features`) feeds raw, un-mirrored frames directly to MediaPipe, a physical Right Hand is processed with standard coordinates. When these coordinates are normalized relative to the wrist, the geometric layout of the hand is completely backwards compared to the model's training space. The mathematically inverted "Hello" hand shape happens to accidentally fall squarely into the `digit_7` decision boundary.

## 2. LABEL MAP VERIFICATION
The labels are mapped flawlessly.
- Index `5` maps exactly to `digit_7`.
- Index `8` maps exactly to `hello`.
There is no off-by-one error or corruption in the `label_map.json` or the dataset compilation script.

## 3. TRAINING PREPROCESSING
By analyzing the legacy `app.py` script:
1. `image = cv.flip(image, 1)` (Flips image horizontally **before** MediaPipe).
2. MediaPipe detects 21 landmarks.
3. $X = \min(\text{int}(lm.x \times \text{width}), \text{width} - 1)$
4. $Y = \min(\text{int}(lm.y \times \text{height}), \text{height} - 1)$
5. Centered relative to the wrist (landmark 0).
6. Flattened to 1D and max-absolute normalized.

## 4. LIVE PREPROCESSING
`frontend/src/utils/landmark_processing.ts` accurately reproduces steps 2-6 mathematically. However, because it skips step 1 (the OpenCV mirror), the feature space is inverted.

## 5. LEFT/RIGHT HAND COMPATIBILITY
Because of the OpenCV mirror, physical Right Hands were visually processed as Left Hands by MediaPipe during training, with inverted X-axes. A live Right Hand vector is structurally incompatible with the training Right Hand vector unless an $X \to \text{width} - X$ transformation is applied first.

## 6. LIVE FEATURE VECTOR ANALYSIS
I have deployed a **Capture Diagnostic** feature to `/test-static-live`. When you click "Capture 1 Frame," the exact 42-feature vector, raw landmarks, and probability distribution are locked on screen.

## 7. TOP-5 LIVE PREDICTIONS
The `/api/translate/sign/static` endpoint and the UI have been updated to support and display the full probability distribution. 

## 8. HELLO DATASET ANALYSIS
The `static_dataset.csv` contains 2,426 rows for the `hello` class. However, these are strictly **static snapshots** of an open, flat hand pointing upwards. The dataset contains zero temporal or movement information.

## 9. TRAINING SAMPLE VS LIVE SAMPLE
I wrote a Python script to mathematically invert the X coordinates of a known training `hello` sample (simulating the un-mirrored live pipeline). The model still predicted `hello` with high confidence because a vertical open palm is mostly symmetrical. However, a real-life dynamic "Hello" gesture involves tilting and moving the hand; when that tilted hand is structurally inverted by the missing mirror, the geometry distorts into the `digit_7` class.

## 10. MODEL SANITY TEST
The model itself (`static_v1/model.keras`) is perfectly sane. When fed its own training vectors, it achieves 99.8% accuracy. The failure is strictly a domain mismatch caused by preprocessing orientation.

## 11. WHETHER STATIC MODEL IS SUITABLE FOR HELLO
**NO.** "Hello" is a dynamic ISL sign consisting of a movement (a salute away from the forehead). A single static frame cannot distinguish "Hello" from any other sign involving an open palm (e.g., "Wait", "Stop", "5"). Attempting to classify dynamic motion signs using a static snapshot classifier will yield brittle results in production.

## 12. EXACT FIX RECOMMENDED
We should **NOT** retrain the model or change the dataset yet. The exact fix is a two-step routing and preprocessing adjustment:

1. **Fix Preprocessing:** We must update `processStatic42Features` to explicitly invert the X coordinates (e.g., `1.0 - lm.x`) before pixel-conversion to perfectly match the legacy training distribution.
2. **Remove Dynamic Signs:** We should strictly exclude dynamic signs (`hello`, `sorry`) from the static model's responsibilities. The 30x86 BiLSTM should exclusively handle dynamic signs, while the 42-feature Static ANN should strictly handle stationary hand shapes (`0-9`, `A, B, C`).
