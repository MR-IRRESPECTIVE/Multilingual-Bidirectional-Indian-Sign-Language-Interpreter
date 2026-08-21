# Static Model V1 - Live Validation Report

*Date: 2026-08-21*
*Model Version: static_v1*
*Classes: 13*

## 1. Pipeline Verification
- **Static_v1 loaded:** YES (13 classes, 42-dimension input)
- **42-Feature Representation:** YES (Exact Atharv/Maitree pixel-space normalization reproduced in `landmark_processing.ts`)
- **API Connectivity:** YES (`POST /api/translate/sign/static` successfully receives and returns predictions)
- **Live Camera UI:** YES (`/test-static-live` running with 1-second inference cooldown)

## 2. Overall Live Performance

| Metric | Result |
|---|---|
| Total Live Attempts | TBD |
| Correct Predictions | TBD |
| Incorrect Predictions | TBD |
| **Live Accuracy** | **TBD%** |
| Average Confidence | TBD% |
| Min Confidence | TBD% |
| Max Confidence | TBD% |

*(Note: Offline Test Accuracy was 99.8%. Compare this to the Live Accuracy above once testing is complete.)*

## 3. Per-Class Accuracy & Reliability

| Class | Accuracy | Reliability Rating | Notes (Position/Lighting/Handedness) |
|---|---|---|---|
| **0** | TBD | 🔴/🟡/🟢 | |
| **1** | TBD | 🔴/🟡/🟢 | |
| **2** | TBD | 🔴/🟡/🟢 | |
| **3** | TBD | 🔴/🟡/🟢 | |
| **4** | TBD | 🔴/🟡/🟢 | |
| **7** | TBD | 🔴/🟡/🟢 | |
| **8** | TBD | 🔴/🟡/🟢 | |
| **9** | TBD | 🔴/🟡/🟢 | |
| **Hello** | TBD | 🔴/🟡/🟢 | |
| **Sorry** | TBD | 🔴/🟡/🟢 | |
| **A** | TBD | 🔴/🟡/🟢 | |
| **B** | TBD | 🔴/🟡/🟢 | |
| **C** | TBD | 🔴/🟡/🟢 | |

## 4. Observations

### Handedness (Left vs Right)
- *TBD: Note if the model favors the right hand (since legacy datasets were often right-hand dominant).*

### Environmental Robustness
- *TBD: Note how the model reacts to being off-center, closer, or further from the camera.*

## 5. Conclusion & Recommendation

**Recommendation for Next Architecture Step:**
*TBD after live results are documented. We will decide whether to proceed with the dual-router, retraining, or a different approach based purely on real camera correctness.*
