# Documentation Validation Report

## 1. What was verified
- **Official SIH Problem Statement:** Verified as SIH1715 (or related). The prompt exactly matches the official problem description. The goal is truly bidirectional (Audio/Text ↔ ISL).
- **Stitch Frontend:** Verified 5 top-level screens exist in project `392239906905445162`. Verified it uses Tailwind CSS, Material Symbols, and Atkinson Hyperlegible Next font.
- **Repository Audit:** Verified that all three repos lack license files. Verified that Repo 3 lacks the `Web-UI` codebase completely. Verified Repo 1 only handles static alphabets. Verified Repo 2 handles only Text-to-ISL via pre-built JSON animations.

## 2. What was corrected
- **Licensing Claims:** Updated to reflect specific A-G component reuse. Replaced naive "unknown" with strict "LICENSE NOT FOUND" prohibiting direct reuse.
- **Dataset Suitability:** Removed assumptions that Kaggle/Include datasets could be reused out of the box due to missing licenses. Explicitly proposed recording a custom 30-50 word dataset.
- **MVP Scope:** Explicitly labeled features as `TARGET` (e.g. Speech-to-Text) vs `VERIFIED` (e.g. MediaPipe tracking latency).
- **Architecture Diagram:** Removed ambiguous "WebSocket" references and aligned the diagram cleanly to the Next.js (Client inference) + FastAPI (NLP) architecture.

## 3. What remains unknown
- The exact source of 3D animations/Avatar that we can legally use for the hackathon.
- Whether English sentence restructuring to SOV (via SpaCy) is linguistically sufficient for the 30-50 chosen MVP words.
- Detailed Stitch component interaction states (hover, error, mobile stacking rules).

## 4. What assumptions were removed
- Removed the assumption that we could fork or merge Repo 3.
- Removed the assumption that we could use the Kaggle dataset directly without license checks.
- Removed the assumption that model accuracy numbers reported in external READMEs were verified.

## 5. What repository claims were corrected
- **Repo 3:** The claim that it includes a `Web-UI` was corrected; the folder is completely empty.

## 6. What licensing questions remain
- Can we use the JSON animations from Repo 2 under "fair use" for a hackathon since it has no license?
- What are the terms of service of Kaggle's ISL dataset?

## 7. What dataset questions remain
- What are the specific 30-50 words we will record?

## 8. What Stitch information was verified
- The 5 primary screens, desktop resolution constraints, typography, icons, and reliance on Tailwind CSS were programmatically verified.

## 9. What frontend decisions remain
- How to handle responsive mobile design (since Stitch only exported DESKTOP device types).
- Detailed mapping of loading/error states which couldn't be extracted via the Stitch API.

## 10. What technical decisions are now ready for implementation
- Next.js + Tailwind CSS for the frontend.
- FastAPI + SpaCy for the backend NLP.
- MediaPipe JS + TensorFlow.js for in-browser client-side ISL recognition (to avoid video stream latency).

## 11. What decisions still require project-owner approval
- Approval to restrict the MVP to a custom dataset of 30-50 words.
- Approval to build from scratch rather than attempting to fix/merge the un-licensed repositories.
- Approval of the frontend responsive fallbacks for mobile views not specified in Stitch.
- Final approval to commence Phase 1 (Baseline Validation).
