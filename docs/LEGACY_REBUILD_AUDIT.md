# LEGACY REBUILD AUDIT

## 1. Repository Structure
### Atharv's Repo (`Bidirectional-Indian-Sign-Language-Translator`)
- `Indian-Sign-Language-to-Text`: Contains `app.py` for live webcam tracking. Contains a static `keypoint_classifier` (42-class) and dynamic `point_history_classifier` (4-class).
- `Text-to-Indian-Sign-Language`: Contains NLP logic using SpaCy (`isl_nlp.py`) to convert English sentences to ISL grammar order (SOV). Also contains a web UI.
- `Videos`: Shows examples of usage.

### SignKit Repo (`signkit-project-`)
- Client-side React app (`Sign-Kit-An-Avatar-based-ISL-Toolkit/client`).
- Extensive `Three.js` 3D animation library (`Animations/Words`, `Animations/Alphabets`, `Animations/Numbers`).
- Includes a 3D Avatar (xbot/ybot).
- Generates sign animations dynamically on the client side using skeletal poses.

## 2. What actually runs
- Atharv's `app.py`: Opens a webcam, uses `cv2.flip`, runs MediaPipe Hands, calculates 42 relative landmarks, and runs a Keras/TFLite model for classification. Also accumulates characters/words.
- SignKit: A React web application that plays 3D animations mapping to text strings.

## 3. What models exist
- **Atharv Keypoint Classifier**: 42-class feed-forward neural network (`keypoint_classifier.hdf5` & `.tflite`).
- **Atharv Point History Classifier**: 4-class LSTM/DNN (`point_history_classifier.hdf5` & `.tflite`).
- **Current Project BiLSTM**: 30x86 dynamic gesture model (10-class, overfitting).

## 4. Model input/output shapes
- **Atharv Keypoint Classifier**: Input (42,) -> Output (42 classes). The 42 features are `(x, y)` for 21 hand landmarks, normalized relative to the wrist and scaled by the max bounding box size.
- **Atharv Point History Classifier**: Input (32, 2) -> Output (4 classes).

## 5. Label vocabulary
- **Atharv Static (42 labels)**: `0-9`, `a-l`, `p`, `s-u`, `x-z`, `hello`, `sorry`, `eat/food`, `indian`, `hearing`, `namaste`, `thank you`, `love`, `house`, `practice`, `good`, `no`, `yes`, `null`.
- **Atharv Dynamic (4 labels)**: `Stop`, `Clockwise`, `Counter Clockwise`, `Move`.
- **SignKit (Animation Vocabulary)**: Dozens of common words (`HELLO`, `SORRY`, `THANKYOU`, `EAT`, `DOCTOR`, `SCHOOL`, etc.) and all alphabets/numbers.

## 6. Dataset sizes
- Atharv's `keypoint.csv` contains thousands of rows.
- SignKit does not use a classification dataset, it uses programmed 3D bone rotations.

## 7. Preprocessing pipeline
- **Atharv**: `image = cv2.flip(image, 1)`. Extracts 21 landmarks. Converts to relative coordinates (`x - wrist_x`, `y - wrist_y`). Normalizes by dividing by the maximum absolute coordinate value.
- **Current**: Same relative conversion but we missed the `flip` context previously, which broke it for live camera feeds.

## 8. Camera pipeline
- Atharv uses OpenCV (`cv2.VideoCapture`). Our current system uses Next.js `react-webcam` + `@mediapipe/hands` in the browser, sending JSON to FastAPI.

## 9. Text-to-sign pipeline
- **Atharv (`isl_nlp.py`)**: Uses SpaCy to extract `nsubj`, `dobj`, `ROOT`, etc. Reorders the sentence to ISL Grammar, checks against a `words.txt` dictionary, and falls back to spelling letters for unknown words.
- **SignKit**: Takes words and triggers Three.js animation files (e.g., `Animations/Words/HELLO.js`).

## 10. Sign playback implementation
- **Current**: Plays individual MP4 videos from `/public/videos`. Poor scaling, requires massive video storage.
- **SignKit**: Client-side 3D rendering (WebGL/Three.js) of an avatar (xbot/ybot). Highly scalable, lightweight.

## 11. What is reusable directly
- **Atharv's `keypoint_classifier.tflite`**: Extremely valuable for recognizing 42 static signs (including letters and digits).
- **Atharv's `isl_nlp.py`**: A great lightweight grammar parser for converting Text to ISL syntax.
- **SignKit's 3D Avatar/Animations**: Much better than static MP4 videos.

## 12. What needs adaptation
- Atharv's TFLite model needs to run behind our FastAPI backend using our new `processStatic42FeaturesFlipped` preprocessing.
- The SignKit React components need to be migrated into our Next.js frontend to replace the `<video>` player.

## 13. What is obsolete
- Current MP4 video playback.
- Current 10-class BiLSTM (too unreliable for a live demo tomorrow).
- Current `static_v1` (since Atharv's original model supports 42 classes natively without retraining).

## 14. What cannot be combined
- We cannot trivially merge the BiLSTM (30x86) and Atharv (1x42) inputs without complex state management. We should use Atharv's static model as the primary workhorse since it actually works.

## 15. Licensing information
- Both are student/hobbyist repositories without explicit strict licenses (assumed open source for this project).

## 16. Recommended architecture for our new system
- **ISL -> Text (Webcam)**: Next.js Webcam -> MediaPipe -> Extract 42 Features (Flipped) -> FastAPI -> Atharv 42-class TFLite Model -> NLP Accumulator -> Sentence Output.
- **Text -> ISL**: Next.js Input -> FastAPI SpaCy Parser (ISL grammar) -> Next.js SignKit Three.js Avatar Player.
