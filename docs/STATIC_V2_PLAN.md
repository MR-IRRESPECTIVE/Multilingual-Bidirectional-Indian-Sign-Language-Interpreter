# Static V2 Plan

## Answers to the 12 Critical Questions

### 1. Why does 99.8% offline accuracy become poor live accuracy?
**Two compounding causes:**
1. **X-axis inversion**: All training data was generated on horizontally flipped images (`cv2.flip(image, 1)` before MediaPipe). The live pipeline sends un-flipped coordinates. The model has literally never seen the un-flipped coordinate geometry.
2. **Dataset leakage**: Random row splitting mixes near-identical consecutive frames across train/test. The 99.8% measures memorization of specific recording sessions, not generalization.

### 2. Is the current preprocessing mathematically identical to training?
**NO.** The current live path (`processStatic42Features`) omits the horizontal flip that was applied during training. The wrist-centering and max-abs normalization are identical, but the input coordinate space is inverted on X.

### 3. Is mirroring responsible?
**YES — this is the primary cause.** The entire X-axis of every live feature vector is inverted compared to training.

### 4. Is handedness responsible?
**Indirectly.** The training was likely done with a right hand on a flipped image (appearing as a left hand to MediaPipe). In live, the same right hand without flipping appears differently. The model is hand-agnostic but implicitly trained on one orientation.

### 5. Is dataset leakage inflating accuracy?
**Almost certainly yes.** Random row splitting on temporally correlated webcam frames creates train/test contamination. However, the severity is unknown without running the near-duplicate analysis.

### 6. How well does Atharv generalize to Maitree?
**Cannot test directly** — the two sources cover completely different classes (digits/words vs A/B/C). No class overlap exists.

### 7. How well does Maitree generalize to Atharv?
**Same answer** — no class overlap, so cross-source validation is structurally impossible with current data.

### 8. How different is live webcam data?
**Catastrophically different due to the X-axis inversion.** Once the flip is applied, the remaining domain gap (different person, lighting, camera, hand size) is a secondary concern that can be assessed empirically.

### 9. What is the smallest change that can make this system reliable?
**Use `processStatic42FeaturesFlipped()` instead of `processStatic42Features()` for all static model inference.** This is a one-line change in the frontend.

### 10. Should we retrain static_v2?
**Not yet.** First test the flip fix. If live accuracy with flipped preprocessing exceeds 80%, the model is structurally sound and retraining is optional. If it remains poor, then retrain with augmented data and cluster-aware splits.

### 11. What exact data should we collect?
If retraining is needed:
- Live webcam samples from the user's actual camera
- Both hands (left and right)
- Multiple angles and distances
- Both flipped and un-flipped (or train exclusively on un-flipped to match future live inference)

### 12. What exact preprocessing should be used?
**Going forward, choose ONE convention and stick to it:**
- **Option A**: Always flip live frames (use `processStatic42FeaturesFlipped`), keep current model
- **Option B**: Retrain model on un-flipped data, use `processStatic42Features` (cleaner long-term)

Option A is the minimal fix. Option B is the clean solution if retraining.

---

## Recommended Action Plan

### Phase 1: Immediate Fix (No Retraining)
1. Modify `/test-static-live` to send **flipped features to static_v1** (not to Atharv legacy)
2. Run live webcam test with A, B, C, 1, Hello — record accuracy
3. If accuracy ≥ 80%: declare the flip fix sufficient for MVP

### Phase 2: If Flip Fix Is Insufficient
1. Run near-duplicate analysis on the dataset
2. Retrain with cluster-aware splits
3. Add data augmentation (small rotations, scale jitter, noise)
4. Save as `static_v2` in `backend/models/archive/static_v2/`

### Phase 3: Long-Term
1. Collect live webcam training data using a standardized pipeline
2. Decide on a single preprocessing convention (flip or no-flip)
3. Expand vocabulary beyond 13 classes
4. Consider cross-source validation with a second signer

---

## Files to Modify (Phase 1 Only)

| File | Change | Risk |
|------|--------|------|
| `frontend/src/app/test-static-live/page.tsx` | Send flipped features to `/api/translate/sign/static` instead of `/api/translate/test/atharv` | Zero risk — test page only |

No model changes. No dataset changes. No architecture changes. No backend changes.
