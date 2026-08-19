# Evaluation Plan

## 1. ISL Recognition (Camera → Text)
- **Accuracy:** Overall percentage of correctly classified signs on a held-out test set. Target: > 85%.
- **Precision/Recall/F1 Score:** To identify if specific signs (e.g., 'A' vs 'S', which look similar) are frequently confused.
- **Confusion Matrix:** Plotted during model training to diagnose overlaps.
- **Inference Latency:** Time taken from frame capture to text output. Target: < 100ms per frame.
- **FPS:** System must maintain > 24 FPS on an average webcam.

## 2. Text to ISL (Text → Avatar)
- **Grammar Conversion Accuracy:** Human evaluation of English-to-ISL gloss translation (e.g., does "What is your name?" correctly convert to "YOUR NAME WHAT?").
- **Animation Latency:** Time taken from pressing 'Translate' to the avatar starting the animation. Target: < 500ms.

## 3. End-to-End Conversation Metrics
- **Successful Communication Rate:** Percentage of test conversation loops (Speech → ISL → ISL → Text) that successfully convey the original meaning. Target: 4 out of 5 predefined dialogues succeed without critical loss of context.
- **Word Error Rate (WER):** For the speech-to-text module (if applicable).
