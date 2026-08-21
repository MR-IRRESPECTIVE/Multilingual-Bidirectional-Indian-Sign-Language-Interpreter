# Static Flip A/B Test

## Objective

Determine whether the poor live webcam accuracy of the static_v1 model is caused by an X-axis mirroring mismatch between training and inference.

## Hypothesis

Both Atharv and Maitree training data were generated after applying `cv2.flip(image, 1)` before MediaPipe landmark extraction. The live frontend sends **un-flipped** MediaPipe coordinates. This X-axis inversion causes the model to see geometrically inverted hand shapes, leading to misclassification.

## Experiment Design

### Model Under Test
- **Model**: `static_v1` (merged Atharv + Maitree ANN)
- **Location**: `backend/models/archive/static_v1/model.keras`
- **Architecture**: BatchNorm → Dense(128) → Dropout → Dense(64) → Dropout → Softmax(13)
- **Classes**: digit_0–digit_4, digit_7–digit_9, hello, sorry, A, B, C

### Endpoint
Both panels use the **exact same** endpoint:
```
POST http://localhost:8000/api/translate/sign/static
```
Body: `{"features": [42 floats]}`

No other model or endpoint is involved. The old Atharv TFLite model is NOT used.

### Panel A: UNFLIPPED Preprocessing
```
MediaPipe landmarks (x, y) from un-flipped video
  → px = floor(lm.x × 640)
  → py = floor(lm.y × 480)
  → subtract wrist (landmark 0)
  → flatten to 42 values
  → max-abs normalize to [-1, 1]
```

### Panel B: MIRRORED Preprocessing
```
MediaPipe landmarks (x, y) from un-flipped video
  → x_sim = 1.0 − lm.x           ← THIS IS THE ONLY DIFFERENCE
  → px = floor(x_sim × 640)
  → py = floor(lm.y × 480)
  → subtract wrist (landmark 0)
  → flatten to 42 values
  → max-abs normalize to [-1, 1]
```

### Why Panel B Simulates the Training Domain

During training, both Atharv (`app.py` line 115) and Maitree (`dataset_keypoint_generation.py` line 76) applied:
```python
image = cv2.flip(image, 1)
```

This horizontally mirrors the image before MediaPipe processes it. When MediaPipe extracts landmarks from a flipped image, the x-coordinates are inverted: a landmark at physical position `x=0.7` appears at `x=0.3` in the flipped image.

Panel B's `x_sim = 1.0 − lm.x` achieves the same mathematical effect without actually flipping the image. The resulting feature vector should match the training domain.

## Test Protocol

### Signs to Test
| Sign | Expected Label | Priority |
|------|---------------|----------|
| A | A | HIGH |
| B | B | HIGH |
| C | C | HIGH |
| 1 | digit_1 | HIGH |
| Hello | hello | HIGH |

### Procedure
1. Open `http://localhost:3000/test-static-live`
2. Start camera and detection
3. For each sign:
   a. Type the expected sign name in the input box
   b. Hold the sign steady
   c. Wait for predictions to stabilize (>7/10 frames)
   d. Click CAPTURE
   e. Repeat 10 times

### Results Template

| # | Expected | A Prediction | A Conf | A ✓ | B Prediction | B Conf | B ✓ | Handedness |
|---|----------|-------------|--------|-----|-------------|--------|-----|------------|
| 1 | A | | | | | | | |
| 2 | A | | | | | | | |
| ... | | | | | | | | |

### Success Criteria
- Panel B achieves ≥80% accuracy across A, B, C, 1, Hello
- Panel B shows ≥60% confidence on correct predictions
- Panel B shows noticeably less class jumping than Panel A
- Panel A shows poor accuracy (confirming the mismatch)

## Implementation

### Files Modified
- `frontend/src/app/test-static-live/page.tsx` — Complete rewrite for rigorous A/B comparison
- `backend/app/api/endpoints.py` — Added `/translate/sign/static` endpoint registration

### Files NOT Modified
- `backend/models/archive/static_v1/` — No model changes
- `datasets/static_training/` — No dataset changes
- `frontend/src/features/text-to-isl/` — SignKit untouched
- `backend/app/services/static_model_service.py` — No inference logic changes
- `frontend/src/utils/landmark_processing.ts` — Both functions already existed
