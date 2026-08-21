# ThrisheiyanUK Forensic Audit

## Model
- **Architecture**: MobileNetV2 / ResNet (Convolutional Neural Networks).
- **Type**: Static image classifier.
- **Pretrained Weights**: `Mobilenetv2_ISL_model.h5` is included and loaded directly.

## Dataset
- **Type**: Custom generated image dataset via `collect_imgs.py`.
- **Samples**: Claimed 500 images per class.

## Classes
- **Total**: 35 classes.
- **Labels**: `1` through `9` and `A` through `Z`.
- **Note**: Does NOT support dynamic signs (e.g. "HELLO", "THANK YOU"). It is purely a static character alphabet/number classifier.

## Preprocessing
- **MediaPipe Usage**: MediaPipe is NOT used for feature extraction. It is ONLY used to find the `x, y` coordinate bounding box around the hand(s).
- **Cropping**: A unified bounding box is drawn around all detected hand landmarks (with a 30px pad).
- **Image Formatting**: The cropped RGB region is resized to `224x224` using `cv2.INTER_AREA`.
- **Normalization**: Pixel values are scaled to `[0, 1]` via `/ 255.0`.
- **Flipping**: Frames are horizontally flipped (`cv2.flip(frame, 1)`) before processing.

## Feature Extraction
- **None**: No geometric features (like normalized landmark coordinates) are extracted. The raw RGB pixels of the cropped hand are fed directly into the CNN.

## Temporal Processing
- **None**: This is a purely static frame-by-frame classifier. There is no LSTM, GRU, or time-series processing.
- **Debouncing**: A naive debouncing mechanism suppresses duplicate insertions unless the label changes or 15 frames have passed (`should_insert = (label != self.last_label or self.frames_since_last_insert > 15)`).

## Inference
- **Shape**: `[1, 224, 224, 3]`.
- **Output**: 35-class softmax probabilities.

## Confidence
- **Display Threshold**: 30% (`0.30`) to render the prediction box on screen.
- **Commit Threshold**: 90% (`0.90`) to insert the text into the translation box.

## Webcam Pipeline
- Uses `cv2.VideoCapture(0)`.
- Renders via Tkinter GUI.
- Runs speech synthesis (`pyttsx3`) in a background thread.

## Dependencies
- `tensorflow>=2.8.0`
- `opencv-python>=4.5.0`
- `mediapipe>=0.8.0`
- `pillow>=8.0.0`
- `pyttsx3>=2.90`

## Known Limitations
1. **No Dynamic Signs**: Does not support words or sentences.
2. **Brittle to Lighting/Background**: Because it uses raw RGB pixels (despite cropping to the hand), CNNs trained on small custom datasets (500 imgs/class) are notoriously brittle to new backgrounds, lighting conditions, and camera qualities compared to geometric landmark features.
3. **No Sequence Modeling**: Completely incapable of understanding motion over time.

## Integration Difficulty
- **High**: Our current architecture relies heavily on MediaPipe geometric landmarks and JSON transmission to a backend for Temporal (LSTM) and Static (ANN) prediction. This repo uses raw RGB transmission (or running TF on the client).

## Recommendation
Waiting for live validation results. However, based on the audit, this is structurally inferior to our existing approach for dynamic signs, as it is strictly a static alphabet CNN.
