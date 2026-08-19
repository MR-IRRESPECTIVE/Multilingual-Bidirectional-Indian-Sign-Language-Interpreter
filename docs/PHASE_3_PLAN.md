# Phase 3 Plan: Custom ISL Dataset and Model Design

## Objective
Design a legally clean, reproducible, and verifiable MVP recognition system to replace the undocumented and unreproducible models found in the research repository.

## Status: DESIGN COMPLETE
We have completed all analysis and design steps for Phase 3. No implementation has started yet.

## Key Decisions Made

### 1. The MVP Vocabulary
We restricted the scope to **10 core ISL words**: Hello, Sorry, Eat/Food, Indian, Namaste, Thank You, Love, Good, Yes, No.

### 2. Static vs. Dynamic Reality
An in-depth linguistic review of the ISLRTC standards proved that **8 out of 10** of these MVP signs are **dynamic**. They require tracking hand trajectory over time (e.g., waving, nodding, circular chest rubbing).

### 3. Model Architecture Pivot
Because the signs are dynamic, the previously tested `Small MLP` (which only looks at a single frame) is insufficient. We have selected a **1D CNN on a Temporal Sequence** (Option D) as our baseline architecture. It will take a rolling 30-frame window of MediaPipe landmarks and run fast, local inference in the browser via TensorFlow.js.

### 4. Custom Dataset
We will record our own dataset. We will extract **only** MediaPipe landmarks (discarding raw video to ensure privacy) using a custom browser-based collection tool. 

### 5. Signer-Independent Evaluation
We will strictly evaluate our model by testing it on a person (signer) that the model *has never seen during training*. This prevents data leakage and ensures true generalization.

## Generated Documentation Output
This design phase produced the following strict specifications:
1. `docs/ISL_MVP_SIGN_SPECIFICATION.md` (Sign linguistics & kinematics)
2. `docs/MODEL_ARCHITECTURE_DECISION.md` (Why 1D CNN over MLP/LSTM)
3. `docs/DATA_COLLECTION_SPECIFICATION.md` (Collection Tool UI & protocol)
4. `docs/CUSTOM_DATASET_PLAN.md` (Volume and strategy overview)
5. `docs/DATASET_SPLIT_AND_EVALUATION.md` (Signer-independent testing rules)
6. `docs/DATA_COLLECTION_PRIVACY.md` (Consent and data retention policy)

## Next Steps (Transition to Phase 4 / Implementation)
With the design phase complete, the next logical implementation steps are:
1. Build the Data Collection Tool (React/Next.js) according to the spec.
2. Run data collection sessions with team members.
3. Write the 1D CNN training notebook using the collected sequences.
4. Export the resulting model to TensorFlow.js.
5. Perform physical human validation in the browser.
