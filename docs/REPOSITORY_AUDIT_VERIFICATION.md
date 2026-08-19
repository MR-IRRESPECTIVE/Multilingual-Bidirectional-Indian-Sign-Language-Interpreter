# Repository Audit Verification

## Repository 1: Indian-Sign-Language-Detection
- **URL:** https://github.com/MaitreeVaria/Indian-Sign-Language-Detection
- **Actual Directory Structure:** Contains `README.md`, `requirements.txt`, `ISL_classifier.ipynb`, `dataset_keypoint_generation.py`, `isl_detection.py`, `keypoint.csv`, `model.h5`, `images/`.
- **Actual Entry Points:** `isl_detection.py` for inference.
- **Actual Model Files:** `model.h5` (Keras Feed-Forward NN).
- **Actual Labels/Classes:** A-Z (excluding some possibly) and 1-9. Inferred from `alphabet` list in `isl_detection.py`.
- **Actual Dataset References:** Kaggle `indian-sign-language-isl` by prathumarikeri.
- **Actual Dependencies:** mediapipe, opencv-python, numpy, pandas, tensorflow.
- **Actual Frontend:** None (OpenCV window only).
- **Actual Backend:** None.
- **Actual APIs:** None.
- **Actual ML Pipeline:** Jupyter notebook for training, single-frame 42-feature input.
- **Actual NLP Pipeline:** None.
- **Actual Avatar/Animation System:** None.
- **Actual Speech Functionality:** None.
- **Actual License Files:** NONE.
- **Actual Third-Party Dependencies:** MediaPipe, TF, OpenCV.

## Repository 2: signkit-project
- **URL:** https://github.com/SanthuruM/signkit-project
- **Actual Directory Structure:** Contains `Sign-Kit-An-Avatar-based-ISL-Toolkit/client/` which has `package.json`, `src/`, `public/`.
- **Actual Entry Points:** `client/src/index.js` (React).
- **Actual Model Files:** None inside the `main` branch.
- **Actual Labels/Classes:** Pre-defined words and alphabets mapped to JSON animations in `Animations/`.
- **Actual Dataset References:** None.
- **Actual Dependencies:** React, Three.js, various npm packages.
- **Actual Frontend:** React web app.
- **Actual Backend:** Claimed Node.js backend on `api` branch (not verified in default clone).
- **Actual APIs:** None in `main` branch.
- **Actual ML Pipeline:** None in `main` branch.
- **Actual NLP Pipeline:** None in `main` branch.
- **Actual Avatar/Animation System:** React Three Fiber playing pre-recorded JSON animations.
- **Actual Speech Functionality:** React speech recognition (browser based).
- **Actual License Files:** NONE.
- **Actual Third-Party Dependencies:** React, Three.js, React-Speech-Recognition.

## Repository 3: Bidirectional-Indian-Sign-Language-Translator
- **URL:** https://github.com/atharvsp189/Bidirectional-Indian-Sign-Language-Translator
- **Actual Directory Structure:** `Indian-Sign-Language-to-Text/` (Flask app, notebooks, models) and `Text-to-Indian-Sign-Language/` (NLP backend, empty Web-UI).
- **Actual Entry Points:** `app.py` in ISL-to-Text. `main.py` in Text-to-ISL-NLP.
- **Actual Model Files:** `keypoint_classifier.tflite` and `point_history_classifier.tflite`.
- **Actual Labels/Classes:** `keypoint_classifier_label.csv` includes 14 words and alphabets.
- **Actual Dataset References:** References 'Include' dataset format implicitly, but uses custom recorded CSVs.
- **Actual Dependencies:** Flask, FastAPI, SpaCy, MediaPipe, TensorFlow.
- **Actual Frontend:** EMPTY `Web-UI` folder. Only a basic Flask HTML template in ISL-to-Text.
- **Actual Backend:** Flask (ISL to Text), FastAPI (Text to ISL).
- **Actual APIs:** FastAPI endpoint in `Text-to-ISL-NLP/main.py`.
- **Actual ML Pipeline:** TensorFlow training notebooks for KeyPoint and PointHistory.
- **Actual NLP Pipeline:** SpaCy rule-based dependency mapping in `isl_nlp.py`.
- **Actual Avatar/Animation System:** Claimed in README, but code is MISSING.
- **Actual Speech Functionality:** None explicitly implemented in source.
- **Actual License Files:** NONE.
- **Actual Third-Party Dependencies:** TF, MediaPipe, SpaCy, Flask, FastAPI.
