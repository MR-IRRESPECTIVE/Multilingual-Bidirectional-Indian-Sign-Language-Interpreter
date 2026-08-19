# Frontend Performance Plan

Do not invent performance numbers. This document defines the metrics that will be measured after baseline testing during Phase 1. 

## Metrics to Measure
- **Camera FPS:** Frames per second captured and rendered by the browser.
- **Landmark Extraction Latency:** Time taken (ms) for MediaPipe JS to extract landmarks from a single frame.
- **Model Inference Latency:** Time taken (ms) for TensorFlow.js to predict the ISL sign from the extracted landmarks.
- **API Latency:** Time taken (ms) for round-trip communication to the FastAPI backend (e.g., text-to-ISL NLP processing).
- **Speech Recognition Latency:** Time taken (ms) for browser native Speech-to-Text or API fallback to return a result.
- **Translation Latency:** Time taken (ms) for Hindi-to-English translation before NLP.
- **End-to-End Conversation Latency:** Total time from a user action (finishing signing / speaking) to the final output (text on screen / avatar animation).
- **Browser Memory Usage:** Peak heap size (MB) during active ISL recognition mode.
- **CPU Usage:** Browser thread utilization percentage during MediaPipe tracking.
- **Mobile Performance:** A subjective and objective score of usability and FPS on a mid-range Android or iOS device.

## Target Values
*Targets will be added here ONLY AFTER baseline validation testing.*
