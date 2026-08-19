# Pilot Dataset Protocol (Phase 4A)

## 1. Pilot Scope
The pilot phase is designed to smoke-test the data collection pipeline, dataset schema, and sequence capturing workflow **before** executing the large-scale 10,000-sample collection. 

**Pilot Goals:**
1. Verify the frontend collection tool functions correctly in-browser.
2. Verify MediaPipe sequence buffering handles dropped frames correctly.
3. Validate IndexedDB local storage and JSON export format.
4. Provide a small temporal dataset to begin architecting the 1D CNN pipeline.

## 2. Target Numbers
- **Signers:** 3 anonymous signers (e.g., team members).
- **Signs:** 3 out of 10 MVP signs.
- **Sequences per sign:** 20 sequences per signer.
- **Total Samples:** 180 (3 × 3 × 20).

## 3. Pilot Sign Selection
Based on `docs/ISL_MVP_SIGN_SPECIFICATION.md`, we select the following 3 signs to cover varying kinematic properties:

| Sign | Type | Justification for Pilot |
|------|------|-------------------------|
| **Hello** | Dynamic (Oscillatory) | Tests the pipeline's ability to capture continuous side-to-side sweeping motion over 30 frames. |
| **Namaste** | Static (Hold) | Tests the pipeline's ability to capture stable two-handed (or dominant hand) static poses. |
| **Yes** | Dynamic (Nodding) | Tests capturing subtle wrist-bending dynamics as opposed to full arm sweeps. |

## 4. Collection Procedure
1. Open the internal Data Collection Tool (running locally on `localhost:3000`).
2. Read the consent notice and agree.
3. Select `Signer ID`.
4. Select `Target Sign`.
5. Sit directly facing the webcam (50-100cm away).
6. Perform the intended ISL sign naturally.
7. Click **Start Recording**.
8. The tool will capture exactly 30 frames of active hand detection.
9. If 30 frames are captured successfully, the status changes to "Valid".
10. Click **Save Sample**.
11. Repeat 20 times per sign.
12. Click **Export Dataset** to download the final `pilot_dataset.json` file.

## 5. Storage and Export
- **Local Storage:** The tool uses browser `IndexedDB` to safely store recorded samples across page reloads. No backend server is required.
- **Export:** The tool exports a unified JSON file containing an array of samples matching the `docs/DATASET_SCHEMA.md` structure.

## 6. Smoke-Test Condition
Before even the 180-sample pilot, a **Smoke Test** is required:
- 1 Signer
- 1 Sign ("Hello")
- 3 Sequences
This guarantees that the raw JSON structure is intact, no NaNs are present, and the sequence arrays have `shape(30, 42)`.
