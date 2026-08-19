# ISL MVP Pilot Dataset

## Overview
This directory contains the data schema, metadata, and JSON exports for the Phase 4A pilot data collection. 

## Dataset Specs (Version 1.0)
- **Vocabulary:** 10 core ISL words (Hello, Sorry, Eat/Food, Indian, Namaste, Thank You, Love, Good, Yes, No)
- **Feature Schema:** 42-dimensional vector per frame (21 hand landmarks * 2 coordinates)
- **Sequence Length:** 30 frames (~1 second of recording)
- **Preprocessing:** Origin shifted to wrist, scaled by maximum absolute coordinate.

## Subdirectories
- `exports/`: The final unified JSON/JSONL datasets exported from the IndexedDB collection tool.
- `metadata/`: Information mapping signers to their anonymized IDs (stored securely, not committed if containing real names).
- `raw-landmarks/`: Intermediate backup files if raw sequence captures are downloaded individually.

## Collection Tool
Data is collected exclusively through the `frontend/src/app/collection/page.tsx` React component which runs MediaPipe strictly in the browser, extracts landmarks, and saves them locally. No raw video is saved.

## Known Limitations
- The 30-frame window is currently a fixed constraint. If a signer signs too quickly, the end of the gesture may be padded or the resting state captured.
- This pilot uses only the dominant/first-detected hand. Two-handed signs (e.g., Namaste, Love) currently track only the most prominent hand in this schema version.
