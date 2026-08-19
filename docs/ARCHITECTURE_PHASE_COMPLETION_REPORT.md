# Architecture Phase Completion Report

## 1. What exactly is the SIH problem asking for?
A bidirectional communication system that can convert English/Hindi text and speech into Indian Sign Language (ISL), and simultaneously convert live camera feeds of ISL gestures back into English/Hindi text/speech.

## 2. What does each repository actually provide?
- **Repo 1:** A basic Python script that extracts MediaPipe hand landmarks and classifies static ISL alphabets using a small Keras Feed-Forward network.
- **Repo 2:** A React-based web application that converts English text/speech into pre-recorded 3D Avatar animations using React Three Fiber. It does NOT do ISL-to-Text.
- **Repo 3:** A disjointed system comprising a Python/SpaCy NLP backend for Text-to-ISL grammar mapping, and a Flask app for ISL-to-Text gesture recognition. The claimed Web-UI folder is entirely empty.

## 3. What can we reuse?
- **SAFE TO STUDY:** The SpaCy NLP grammar rules from Repo 3.
- **SAFE TO STUDY:** The PointHistory and KeyPoint classifier logic from Repo 3.
- **SAFE TO STUDY:** The React Three Fiber avatar rendering concept from Repo 2.

## 4. What cannot we reuse?
- We cannot reuse the source code directly due to missing LICENSE files in all three repositories. Doing so poses a severe plagiarism and licensing risk for SIH.
- We cannot reuse Repo 3's Flask video streaming approach, as sending raw frames to a backend introduces massive latency.

## 5. What needs to be rebuilt?
- The entire codebase needs to be rebuilt cleanly.
- The computer vision inference needs to be moved to the client side (browser) using MediaPipe JS and TensorFlow.js.
- The React frontend needs to be built from scratch to integrate the chat UI and the 3D Avatar.
- A custom dataset of 30-50 conversational words needs to be recorded using our team members.

## 6. What is our MVP?
A unified web interface where a user can type/speak English (and translate Hindi) which animates a 3D avatar, and an ISL user can sign to the webcam which outputs English text. It relies on a strictly controlled vocabulary of 30-50 words.

## 7. What is outside the MVP?
- Full 5000+ word ISL dictionary.
- Complex multi-sentence context translation.
- Facial expression and full-body pose recognition (MediaPipe Holistic will be Phase 2).
- Native iOS/Android apps (we use responsive web for MVP).

## 8. What is our proposed architecture?
- **Client:** Next.js / React, handling UI, Avatar rendering (Three.js), and local MediaPipe/TF.js inference for zero-latency ISL recognition.
- **Server:** FastAPI (Python) handling SpaCy NLP grammar conversions and Hindi translation APIs.

## 9. What is our proposed tech stack?
- React/Next.js, Three.js, MediaPipe JS, TensorFlow.js, Python, FastAPI, SpaCy.

## 10. What datasets do we need?
- A custom recorded CSV dataset of MediaPipe normalized (X,Y) coordinates for our 30-50 target words, as existing datasets either lack words or lack clear licenses.

## 11. What models do we need?
- **NLP:** SpaCy `en_core_web_sm` for POS tagging and SOV restructuring.
- **CV:** A lightweight MLP / simple LSTM trained in TensorFlow and exported to TF.js.

## 12. What are the biggest technical risks?
- Sourcing or creating 30-50 3D animations for the avatar if open-source options are restricted.
- Implementing dynamic sign recognition (LSTM) reliably in the browser.

## 13. What are the licensing risks?
- None of the reference repositories have licenses. We must write our own code and build our own dataset.

## 14. What can six people realistically build?
- A robust, highly polished, low-latency MVP demonstrating the *architecture* working flawlessly on 30 words, rather than a broken system attempting 1000 words.

## 15. What should be done first?
Phase 1 (Baseline Validation): Write 3 separate throwaway scripts to prove:
1. MediaPipe runs fast in the browser.
2. SpaCy grammar mapping works on basic sentences.
3. A 3D model can be animated via React Three Fiber.

## 16. What information is still unknown?
- Where to source the 3D avatar and animation files legally for hackathon use (Assumption A-02).
- The exact 30 words we will choose for the MVP dictionary.

## 17. What decisions require approval from the project owner?
- Approval to restrict the MVP to 30-50 words.
- Approval of the DEC-001 (building from scratch rather than merging the broken repos).
- Approval to move to Phase 1: Baseline Validation.

*This concludes the Architecture & Research Phase.*
