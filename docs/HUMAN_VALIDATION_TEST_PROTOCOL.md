# Human Validation Test Protocol

This document outlines the strict protocol for physically testing the TFLite ISL Recognition Model (Baseline 1) using human signers. 

## 1. Setup Requirements

- **Supported Browser:** Chromium-based browser (Google Chrome, Microsoft Edge, Brave) is highly recommended for best WebAssembly/WebGL support.
- **How to Open:** 
  - Simply open the `poc/mediapipe_poc.html` file in your browser. 
  - *Note:* If your browser restricts camera access for local `file://` URLs, you may need to serve it via a local web server (e.g., `python -m http.server 8000` or `npx serve poc/`).
- **Camera Permissions:** You must grant the browser permission to use your webcam.
- **Recommended Lighting:** Even, diffused indoor lighting. Avoid heavy backlighting (like sitting in front of a bright window).
- **Recommended Position:** Ensure your face and upper torso (including both hands) are visible in the frame.
- **Recommended Distance:** 0.5 to 1.0 meters from the camera.

## 2. Test Procedure

For each available word class in the model (e.g., hello, sorry, eat/food, namaste, thank you):

1. **Select Expected Sign:** Use the dropdown menu in the testing interface to select the sign you are about to perform.
2. **Position Hand:** Bring your hand into the frame. Wait for MediaPipe to draw the green skeleton over your hand.
3. **Perform Sign:** Perform the sign naturally and hold it for 1-2 seconds.
4. **Observe Stabilized Prediction:** Wait for the "STABILIZED PREDICTION (Majority Vote)" field to settle.
5. **Record Pass/Fail:** Click the **Record Attempt** button to log the result to the screen.
6. **Repeat:** Perform at least 5 attempts per sign.
7. **Move to Next Sign:** Repeat the process for the next word.

## 3. Environmental Tests

To test the robustness of the static coordinate model, please perform the above procedure under varying conditions:
- **Normal Lighting:** Standard office/room lighting.
- **Bright Lighting:** Strong overhead lighting or outdoors.
- **Lower Lighting:** Dimmer room (where the hand is still visibly tracked by MediaPipe).
- **Normal Distance:** Arm's length (0.5m).
- **Increased Distance:** Stepping back (~1.0m to 1.5m) so the hand appears smaller in the frame.

## 4. Multi-Person Test (Crucial)

If possible, repeat the test with at least three different individuals:
- **Signer A**
- **Signer B**
- **Signer C**

This is critical to determine if the model has overfit to the original dataset's specific hand size or skin tone.

## 5. Test Data Format

When returning your results, please format the data cleanly in JSON or CSV. 

Example JSON format:
```json
[
  {
    "signer": "A",
    "expected": "namaste",
    "predicted": "namaste",
    "correct": true,
    "model_score_avg": 0.98,
    "conditions": {
      "lighting": "normal",
      "distance": "0.5m"
    }
  },
  {
    "signer": "A",
    "expected": "eat/food",
    "predicted": "sorry",
    "correct": false,
    "model_score_avg": 0.65,
    "conditions": {
      "lighting": "normal",
      "distance": "0.5m"
    }
  }
]
```
*Note: Do NOT collect or share any personally identifiable information (PII) or raw video recordings.*

## 6. Accuracy Calculation

Once the data is returned, we will calculate:
- **Total Attempts:** The sum of all recorded attempts.
- **Overall Accuracy:** `Total Correct / Total Attempts * 100`
- **Per-Class Accuracy:** `Correct for Class X / Total Attempts for Class X * 100`

If the sample size exceeds 50 total attempts across 3 signers, we will generate a formal Confusion Matrix to identify if certain signs are consistently confused (e.g., "hello" vs "namaste").

## 7. Current Testing Checklist Status

- [x] Camera works
- [x] MediaPipe works
- [x] Landmarks detected
- [x] Preprocessing verified
- [x] Model loads
- [x] Prediction appears
- [x] Stabilization works (5-frame majority vote)
- [x] Expected-sign selection works
- [x] Pass/Fail recording works
- [x] No video is stored (results are kept purely in the DOM log)
- [x] FPS visible
- [x] Inference latency visible
- [x] Human testing instructions complete
