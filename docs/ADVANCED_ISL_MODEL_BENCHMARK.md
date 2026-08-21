# Advanced ISL Model Benchmark

## Executive Summary

We performed a deep forensic audit on three advanced ISL recognition projects (iSign, ISLTranslate, SignComm) to determine if a pretrained model exists that surpasses our current `static_v1` ANN and `BiLSTM` temporal models.

The primary discovery is that **no advanced pretrained temporal model is available across these repositories.**
- **iSign / ISLTranslate** are purely dataset releases. Their GitHub repositories do not contain inference code, and their pretrained model weights are not published on HuggingFace or their websites.
- **SignComm** provides a pretrained model, but it is not an advanced ISL sentence translator. It is a simple static image classifier (using a 42-feature DNN, functionally identical to our existing static architecture). It relies on a commercial cloud LLM (`gemini-2.0-flash`) to fake sentence generation by stringing together statically recognized words.

---

## The Core Question: Can We Run a Pretrained Model Locally?

### 1. iSign & ISLTranslate
**UNCERTAIN / NO**
- **Exact Model**: Not published.
- **Download Source**: HuggingFace dataset contains CSVs, MP4s, and Mediapipe coordinates, but no `.pt`/`.h5`/`.tflite` weights. The GitHub repository link (`https://github.com/Exploration-Lab/iSign`) returns a 404 Not Found error.
- **What would be required**: To use this research, we would have to download the 200+ GB dataset, design a Transformer/LSTM sequence architecture from scratch, and spend days training the model locally.

### 2. SignComm
**YES**
- **Exact Model**: A 4-layer DNN (Fully Connected) static gesture classifier.
- **Download Source**: Included directly in their GitHub repository (`keypoint_classifier.tflite`).
- **Required Dependencies**: `tensorflow`, `mediapipe`, `opencv-python`.
- **Expected Input Tensor**: `[1, 42]` array of flattened, normalized wrist-relative MediaPipe landmarks.
- **Expected Output**: Softmax probabilities across 32 static classes.
- **Vocabulary**: 32 static words ("Hello", "Peace", "Me/I", "You/Him", "Past", "Future", etc.).

---

## Comparison Matrix

| System | Pretrained | Vocabulary | Dynamic | Sentence Translation | Webcam | CPU | Recommendation |
|--------|------------|------------|---------|----------------------|--------|-----|----------------|
| **Current BiLSTM** | Yes | ~20 words | Yes | Real Sequence Modeling | Yes | Yes | Keep (for now) |
| **Current Static** | Yes | 26+ | No | No | Yes | Yes | Keep (for now) |
| **Atharv** | Yes | Alphabets | No | No | Yes | Yes | Reject |
| **ThrisheiyanUK** | Yes | 35 (A-Z, 0-9)| No | No | Yes | Yes | Reject |
| **SignComm** | Yes | 32 words | No | Faked via Cloud LLM | Yes | Yes | Reject |
| **iSign / ISLTranslate** | **No** | 31,000 | Yes | Yes (in paper only) | N/A | N/A | Reject (Missing Code/Model) |

---

## Project Breakdown

### iSign & ISLTranslate
- **Relationship**: `ISLTranslate` (2023) is a dataset containing 31,000 ISL-English pairs. `iSign` (2024) is the benchmark built on top of that dataset, introducing standard tasks (SignVideo2Text, SignPose2Text). They are both by the "Exploration-Lab" group.
- **Model Availability**: The paper mentions benchmarking a Transformer-based model, but neither the source code nor the pretrained model files were released publicly. The code repository links are dead.

### SignComm
- **Architecture**: A very basic static DNN (Dense layers) identical in structure to Kazuhito00's famous hand gesture recognition code. 
- **The "Sentence" Trick**: If you examine `gemini.py` in the SignComm repository, you find that the system merely classifies static frames (e.g., "Hello", "Me", "Peace") and makes a REST call to `gemini-2.0-flash` with the prompt: *"You are an expert sign language translator... Combine the words into a complete, grammatically correct sentence."* It is not doing sequence translation at all.

---

## Final Recommendation

**A. KEEP CURRENT SYSTEM** (and eventually explore Option E)

None of the investigated repositories offer a downloadable, offline, real-time, dynamic ISL sentence translation model. 

1. **SignComm** is a parlor trick that relies on Gemini to string static words together, offering no actual improvement over our existing `static_v1` architecture.
2. **iSign/ISLTranslate** has massive potential (31k words), but without the authors releasing the model weights or the architecture code, we cannot use it without downloading the 200GB dataset and undertaking a massive, specialized machine learning training project.

**Next Steps**: Since we have ruled out finding an open-source pretrained "silver bullet" for ISL-to-Text, our best path forward is to iteratively improve our existing `BiLSTM` model, collect a better local dataset, and potentially use the `ISLTranslate` dataset for custom training **if** we acquire the necessary GPU compute infrastructure in the future.
