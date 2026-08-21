# ATHARV LIVE MODEL VALIDATION

## 1. Supported Classes (From Label Map)
0, 1, 2, 3, 4, 7, 8, 9, hello, sorry, a, b, c, d, e, f, g, h, i, j, k, l, p, s, t, u, x, y, z, eat/food, indian, hearing, namaste, thank you, love, house, practice, good, no, yes, null

## 2. Classes with Actual Training Data
*(Based on inspecting keypoint.csv. Has many examples for most classes.)*

## 3. Model Output Dimensions
- Input: `42` (21 landmarks * 2 coordinates, relative to wrist, normalized by max bounding box)
- Output: `42` (Softmax probability array mapping to the 42 labels)

## 4. Preprocessing Behavior
- Reads frame from OpenCV.
- Performs `cv.flip(image, 1)` horizontally.
- Runs MediaPipe Hands on the flipped frame.
- Calculates bounding box.
- Subtracts wrist (landmark 0) coordinates from all other landmarks.
- Divides by the maximum absolute coordinate value in the hand to scale it to `[-1, 1]`.

## 5. Live Predictions (User Test Matrix)
*Instructions: Run `scratch/venv312/Scripts/python scratch/reference/Bidirectional-Indian-Sign-Language-Translator/Indian-Sign-Language-to-Text/app.py` from the project root and test these signs in front of the OpenCV window.*

| Sign | Works? (Yes/No) | Average Confidence | Notes/Failures |
|------|----------------|--------------------|----------------|
| Hello | | | |
| Sorry | | | |
| Thank You | | | |
| A | | | |
| B | | | |
| C | | | |
| 1 | | | |
| 2 | | | |
| Namaste | | | |
| Love | | | |

## 6. Handedness Behavior
Does it work for the Right Hand? *(Yes/No)*
Does it work for the Left Hand? *(Yes/No)*

## 7. Dynamic vs Static Limitations
The `keypoint_classifier` is purely static. It takes a single frame snapshot. Words like "Thank You" or "Sorry" which involve motion are recognized based on their terminal or most distinct static pose in this architecture.

## 8. Conclusion
Should we migrate the Atharv 42-class Keypoint Classifier into our FastAPI backend to replace `static_v1` and the broken 10-class BiLSTM for tomorrow's demo? 
*(Awaiting user live test results)*
