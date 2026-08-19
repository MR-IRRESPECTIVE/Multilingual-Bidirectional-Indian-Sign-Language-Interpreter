# Dataset and Model Plan

## Dataset 1: Kaggle ISL Image Dataset (Referenced in Repo 1)
- **Dataset Name:** indian-sign-language-isl
- **Source URL:** https://www.kaggle.com/datasets/prathumarikeri/indian-sign-language-isl
- **License:** UNKNOWN (Requires Kaggle verification).
- **Number of Classes:** ~35 (A-Z, 1-9)
- **Class Names:** 1-9, A-Z.
- **Static/Dynamic:** Static
- **Image/Video:** Image
- **Signer Information:** Unknown
- **Train/Test Split:** Unknown
- **Known Limitations:** Only static alphabets/numbers. Cannot be used for word-level MVP.

## Dataset 2: IncludeSign / Custom CSV (Referenced in Repo 3)
- **Dataset Name:** Custom Keypoint CSV (keypoint_classifier_label.csv)
- **Source URL:** N/A (Included in Repo 3)
- **License:** LICENSE NOT FOUND (Cannot reuse).
- **Number of Classes:** 42 classes (including "null").
- **Class Names:** hello, sorry, eat/food, indian, hearing, namaste, thank you, love, house, practice, good, no, yes, null, plus 28 alphabet/number signs.
- **Static/Dynamic:** Static (KeyPoint), basic Dynamic (PointHistory).
- **Image/Video:** CSV of extracted MediaPipe coordinates.
- **Signer Information:** Unknown.
- **Train/Test Split:** Not provided in repo.
- **Known Limitations:** Cannot legally reuse.

## Proposed Dataset Strategy for MVP
Since public ISL datasets for continuous signing are extremely limited and inherited datasets have no license:
1. We will RECORD OUR OWN custom dataset of 30-50 conversational words using team members.
2. We will use the Stitch UI (if camera collection is added) or local scripts to record.
3. Train a lightweight DNN/LSTM on these coordinates.

## Dataset properties for our custom dataset:
- **Signer diversity:** Target at least 3-4 different team members.
- **Language:** ISL (Indian Sign Language).
- **Format:** CSV files of normalized MediaPipe (X, Y, Z) coordinates over T frames.
