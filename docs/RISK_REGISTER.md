# Risk Register

| Risk | Probability | Impact | Mitigation |
| :--- | :--- | :--- | :--- |
| **Dataset unavailable** | High | High | Record our own custom dataset of 30-50 words using our team members. Keep vocabulary controlled for MVP. |
| **Dataset license unclear** | Medium | Medium | Do not use Kaggle/unknown datasets for final submission. Rely on self-recorded data. |
| **Existing model performs poorly** | Medium | High | Use simpler ML architectures (MLP/LSTM) with highly normalized landmark data instead of raw images. |
| **Dynamic sign recognition difficult** | High | Medium | Use a sliding window queue (e.g. `deque` in Python) to feed multiple frames into an LSTM. |
| **Avatar integration difficult** | High | High | Use React Three Fiber. If animations are too hard to source, fallback to displaying pre-recorded 2D videos of signs for MVP. |
| **ISL grammar complexity** | High | Medium | Implement basic Subject-Object-Verb (SOV) restructuring and drop stop-words. Leave complex context grammar for Phase 3. |
| **Hindi processing issues** | Medium | Medium | Use `googletrans` or similar API to convert Hindi -> English -> ISL Gloss internally as a fallback. |
| **Mobile inference too slow** | Low | High | Use TF.js / TFLite and MediaPipe directly in the browser to leverage WebGL/WASM acceleration. |
| **GPU unavailable** | Low | Low | Coordinate-based ML models (MediaPipe output) are tiny and can be trained on standard CPUs within minutes. |
| **Repository dependency failure** | Medium | Low | Do not blindly install `requirements.txt` from old repos. Pin dependencies to modern stable versions. |
| **Integration complexity** | Medium | High | Establish clear API contracts (JSON payloads) between Frontend and Backend in Phase 2. |
| **Insufficient development time** | High | High | Strictly adhere to the MVP scope. Do not attempt unrestricted translation. |
