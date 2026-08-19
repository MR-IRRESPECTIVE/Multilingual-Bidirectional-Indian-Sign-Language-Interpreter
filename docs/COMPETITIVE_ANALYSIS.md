# Competitive Analysis

## Competitor 1: Repository 1 (ISL-Detection)
- **Features:** Static alphabet/number recognition.
- **Technology:** MediaPipe + FNN.
- **Limitations:** No word recognition, no dynamic signs, no text-to-ISL, no UI.
- **What they solved:** Basic MediaPipe coordinate extraction and training loop.
- **What we improve:** Adding word recognition, temporal sequence modeling (LSTM), bidirectional flow.

## Competitor 2: Repository 2 (SignKit)
- **Features:** Text/Speech to ISL Avatar.
- **Technology:** MERN Stack, React Three Fiber.
- **Limitations:** No ISL-to-Text capability (one-way only). Unclear source of animations.
- **What they solved:** Displaying 3D animations in a React web app.
- **What we improve:** Adding the camera-based ISL recognition module to make it bidirectional.

## Competitor 3: Repository 3 (Bidirectional-ISL-Translator)
- **Features:** ISL-to-Text (Words/Alphabets), Text-to-ISL (NLP SOV grammar).
- **Technology:** Flask, FastAPI, MediaPipe, SpaCy.
- **Limitations:** Missing frontend Web-UI code. Fragmented architecture (requires running multiple separate servers). 
- **What they solved:** Basic ISL Grammar rules (SpaCy), KeyPoint and PointHistory classifiers.
- **What we improve:** Unifying the system into a single cohesive Web App (Next.js + FastAPI) with a seamless conversational interface.

## Overall Gap
Most existing solutions either do ONLY gesture recognition OR ONLY avatar animation. The ones that attempt both (like Repo 3) suffer from poor integration and missing user interfaces. Our major improvement will be a seamless, low-latency, unified conversational UI that handles both directions natively in the browser.
