# MVP Specification

## Platform format
- The MVP will be a single responsive Next.js web application accessible via browser on desktop, tablet, and mobile.
- A native mobile app (e.g. Flutter/React Native) is NOT part of the MVP scope.

## Direction A: English/Hindi → ISL
- **Input:** English text, Hindi text. (English/Hindi Speech is a TARGET for Phase 2, but web-native Speech API could be used if time permits).
- **Processing:** 
  Input ↓ Language Detection (if needed) ↓ Text Normalization ↓ NLP (SpaCy-based grammar conversion to ISL gloss) ↓ ISL Gloss / Sign Sequence mapping ↓ ISL Avatar Animation Output
- **Output:** ISL 3D Avatar (TARGET).

## Direction B: ISL → English/Hindi
- **Input:** Live camera feed / webcam video.
- **Processing:**
  Camera ↓ Frame Processing ↓ Landmark Detection (MediaPipe) ↓ ISL Recognition (TFLite/TF.js ML Model) ↓ Sign Sequence ↓ English/Hindi Text Mapping.
- **Output:** English/Hindi text on screen. (English/Hindi speech is a TARGET for Phase 2).

## Conversation Mode
- A unified UI where users can take turns communicating (TARGET based on Stitch Design).
- **Example:**
  - English/Hindi speaker: "Hello" (Text input) → Avatar signs "Hello".
  - ISL user signs: "Hello" (Camera input) → Screen displays "Hello".

## Explicit MVP Limitations
- MVP does NOT promise unrestricted ISL translation.
- MVP does NOT promise perfect ISL grammar or sentence translation.
- MVP will use a controlled vocabulary (TARGET: 30–50 common conversational signs).
- MVP focuses on static signs and basic dynamic gestures.
- MVP does NOT promise complete facial-expression interpretation or full body-language interpretation (MediaPipe Hands only, Holistic is Phase 2).
- VERIFIED: MediaPipe hand extraction is capable of running real-time.
- VERIFIED: SpaCy rule-based grammar mapping works for basic sentences.
- 100% accuracy is not guaranteed in real-time edge cases.
