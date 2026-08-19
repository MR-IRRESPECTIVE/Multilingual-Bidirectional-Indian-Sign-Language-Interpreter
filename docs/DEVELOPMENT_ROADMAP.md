# Development Roadmap

## Phase 0 — Research & Documentation
- **Goal:** Establish a single source of truth and architecture (CURRENT PHASE).
- **Tasks:** Repo analysis, documentation generation, technology selection.
- **Deliverables:** All Markdown specification files.
- **Status:** In Progress.

## Phase 1 — Baseline Validation
- **Goal:** Create simple proof-of-concepts for risky tech.
- **Tasks:** Run MediaPipe in browser, test SpaCy grammar rules, render a basic 3D model in React.
- **Deliverables:** 3 isolated POC scripts.
- **Estimated duration:** 3-5 days.

## Phase 2 — Architecture Integration
- **Goal:** Setup repository structure, CI/CD, and basic routing.
- **Tasks:** 
  - [x] Initialize the single responsive Next.js frontend web application.
  - [x] Create the isolated Mock Data layer for frontend development.
  - [x] Initialize FastAPI backend.
  - [x] Ensure they can communicate via defined APIs (or POC tested).
- **Deliverables:** Hello World full-stack app + Feasibility POC.
- **Estimated duration:** 2 days.

## Phase 2B — Real ISL Recognition Baseline Validation
- **Goal:** Prove the actual model correctly processes and recognizes ISL signs.
- **Tasks:**
  - [x] Inspect exact TFLite model and labels.
  - [x] Verify original preprocessing pipeline.
  - [x] Build end-to-end recognition POC in browser.
  - [x] Implement majority-vote temporal stability.
  - [x] Document accuracy, performance, and model suitability.
- **Deliverables:** Phase 2B Validation Report and working POC.
- **Status:** Complete (Discovered model is unreproducible/unusable).

## Phase 3 — Custom Dataset & Model Design
- **Goal:** Design our own legally clean 10-word MVP model.
- **Tasks:**
  - [x] Linguistic analysis of 10 MVP signs (Static vs Dynamic).
  - [x] Design data collection protocol and privacy policy.
  - [x] Select temporal model architecture (1D CNN).
  - [x] Define evaluation methodology.
- **Deliverables:** All Phase 3 specification documents.
- **Status:** Complete.

## Phase 4A — Data Collection Pilot
- **Goal:** Validate the dataset schema, tooling, and pipeline with a small subset.
- **Tasks:**
  - [x] Build React-based Data Collection UI.
  - [x] Create dataset schema, test feature normalization.
  - [x] Perform Smoke Test (1 signer, 1 sign, 3 sequences).
  - [ ] Collect Pilot Dataset (3 signers, 3 signs, 20 sequences each).
- **Status:** In Progress.

## Phase 4B — Full Data Collection & Training
- **Goal:** Gather data, train the baseline.
- **Tasks:**
  - [ ] Collect 100+ sequences per sign across 3+ signers.
  - [ ] Train 1D CNN baseline model.
  - [ ] Convert model to TensorFlow.js.
- **Estimated duration:** 3-5 days.
- **Status:** Next.

## Phase 5 — NLP Integration & Translation Wiring
- **Goal:** Implement the bidirectional Text <-> ISL backend pipeline.
- **Tasks:** Setup SpaCy grammar conversion on FastAPI. Connect the Next.js `RealRecognitionService` to the model.
- **Deliverables:** Working end-to-end translation for the baseline vocabulary.

## Phase 4 — Conversation Mode
- **Goal:** Connect both directions into a seamless chat interface.
- **Tasks:** Build the split-screen or chat UI, add Speech-to-Text and Text-to-Speech.
- **Deliverables:** End-to-end conversational prototype.
- **Estimated duration:** 1 week.

## Phase 5 — Accuracy & Reliability
- **Goal:** Improve model accuracy and handle edge cases.
- **Tasks:** Expand dataset, tune hyperparameters, improve fingerspelling fallback.
- **Deliverables:** 85%+ accuracy on test set.
- **Estimated duration:** 1 week.

## Phase 6 — UI/UX
- **Goal:** Polish the application.
- **Tasks:** Add loaders, error handling, responsive mobile layouts, branding.
- **Deliverables:** Professional-looking app ready for demo.
- **Estimated duration:** 4 days.

## Phase 7 — Testing
- **Goal:** Validate with real users.
- **Tasks:** Have external people try the system, fix critical bugs.
- **Deliverables:** Bug fixes.
- **Estimated duration:** 3 days.

## Phase 8 — SIH Demo
- **Goal:** Prepare presentation and pitch.
- **Tasks:** Record demo video, create slides, finalize README.
- **Deliverables:** Final SIH submission package.
- **Estimated duration:** 3 days.
