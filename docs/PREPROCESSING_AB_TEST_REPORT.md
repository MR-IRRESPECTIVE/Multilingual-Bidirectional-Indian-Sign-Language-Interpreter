# PREPROCESSING A/B TEST REPORT

## 1. Legacy Preprocessing Evidence
**Finding:** Both Atharv and Maitree legacy datasets used `cv2.flip(image, 1)` **before** feeding the image to MediaPipe.
- `Atharv's app.py`: Line 79 `image = cv.flip(image, 1)`
- `Maitree's dataset_keypoint_generation.py`: Line 35 `image = cv2.flip(cv2.imread(file), 1)`

**Conclusion:** The entire 27,919 row training dataset is horizontally mirrored on the X-axis. A physical Right Hand was trained as a visual Left Hand, and all X coordinates were effectively converted to `(width - x)`.

## 2. Current Preprocessing Description
The current live implementation (`processStatic42Features`) perfectly replicates the pixel scaling, wrist centering, and max-abs normalization. However, it processes raw un-mirrored frames from the Next.js `<video>` feed.

## 3. Mathematical Difference
To simulate the legacy domain in live tracking without modifying the image, we must apply `(1.0 - x)` to the MediaPipe normalized coordinates before converting to pixel space. This is now implemented as `processStatic42FeaturesFlipped`.

## 4. A/B Live Results (Primary Signs)
*Instructions: Perform each sign 5+ times in front of the camera using the A/B test UI. Record the dominant prediction and confidence.*

| Sign | Current Preprocessing | Flipped Preprocessing (Legacy) |
|------|-----------------------|--------------------------------|
| **A** | | |
| **B** | | |
| **C** | | |
| **0** | | |
| **1** | | |
| **2** | | |
| **3** | | |
| **4** | | |
| **7** | | |
| **8** | | |
| **9** | | |

## 5. C vs Digit-1 Results
*Instructions: Specifically test if `C` is confused with `digit_1`.*

- **C under Current Preprocessing:**
- **C under Flipped Preprocessing:**
- **Digit 1 under Current Preprocessing:**
- **Digit 1 under Flipped Preprocessing:**

*Does the `C -> digit_1` misclassification disappear under flipped preprocessing?*
> [Record observation here]

## 6. Atharv Model Comparison (Offline Validation)
*To be run via offline TFLite script if requested.*
- **Static V1 (Flipped):**
- **Atharv Legacy (Flipped):**

## 7. Hello Static-vs-Temporal Analysis
*Instructions: Test a static open palm (Hello pose) vs a moving dynamic "Hello".*
- **Static V1 (Current):** (e.g. digit_7)
- **Static V1 (Flipped):** (e.g. hello, 99%)
- **BiLSTM (Production):** (Can it recognize the dynamic movement?)

## 8. Final Recommendation
Based on the evidence above, which preprocessing domain should we retain for the static branch?
> [Wait for user testing results]
