# Custom Dataset Plan

## 1. Overview
The original repository's dataset (`keypoint.csv`) lacks both 41-class coverage and a clear open-source license. As a result, we are building a custom, legally controlled dataset for our 10-word MVP vocabulary.

## 2. Target Vocabulary (10 Signs)
1. Hello
2. Sorry
3. Eat / Food
4. Indian
5. Namaste
6. Thank You
7. Love
8. Good
9. Yes
10. No

## 3. Data Representation
Because **80% of our signs are dynamic** (requiring motion tracking), our dataset must store **temporal sequences**, not just isolated static frames.
- **Format:** JSON Lines (`.jsonl`) sequence files.
- **Features per frame:** 42 normalized float values (MediaPipe 21 hand landmarks × x,y relative coordinates).
- **Sequence Length:** Variable during collection; will be padded/truncated to 30 frames (1 second at 30 FPS) during ML preprocessing.

## 4. Collection Strategy
- **Pilot Phase (Current):** Before collecting thousands of samples, we will run a small pilot (180 samples total: 3 signers, 3 signs, 20 samples each) to validate the JSON schema, temporal window length (30 frames), and IndexedDB storage.
- **Signers:** Minimum 3 human team members/volunteers (target: 5+).
- **Tooling:** We will build a browser-based "ISL Data Collection Tool" that overlays MediaPipe onto a webcam feed, allowing users to select a sign and record 1-2 second landmark sequences.
- **Volume:** Target is 100 sequences per sign, per signer. For 5 signers, this yields 5,000 temporal training examples.

## 5. Privacy & Ethics
- All signers must give informed consent (see `docs/DATA_COLLECTION_PRIVACY.md`).
- We only save extracted abstract coordinates (landmarks).
- **No raw video** will be permanently stored or committed to the repository, eliminating facial privacy concerns.
- Signers will be labeled with anonymous IDs (`signer_A`, `signer_B`, etc.).

## 6. Evaluation Split
To ensure the model learns generalized ISL rules rather than memorizing a specific person's hands:
- **Train:** Signers A, B, C (~60%)
- **Validation:** Signer D (~20%)
- **Test:** Signer E (held-out, unseen during training) (~20%)

*If only 3 signers are available, we will perform Leave-One-Signer-Out Cross Validation.*
