# Assumptions Register

| ID | ASSUMPTION / UNKNOWN | WHY WE MADE IT | EVIDENCE | CONFIDENCE | HOW TO VERIFY | STATUS |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| A-01 | MediaPipe can run at >24fps on average client hardware. | Required for real-time ISL recognition in browser. | Verified via MediaPipe official docs and POC HTML. | High | Build simple JS test page. | VERIFIED |
| A-02 | We can find or create open-source 3D animations for ISL. | Required for the Avatar component. | Repo 2 (SignKit) has JSON animations, but license is unknown. | Low | Check Mixamo/ReadyPlayerMe or Repo 2 authors. | UNKNOWN |
| A-03 | English sentence restructuring to SOV is sufficient for basic ISL. | Required to simplify NLP. | Repo 3 uses this approach with SpaCy. | Medium | Consult an ISL expert or linguistic papers. | UNKNOWN |
| A-04 | 30-50 words is an acceptable MVP size for SIH. | We cannot build a 5000+ word dictionary in 2 months. | Hackathon constraints generally accept MVPs over full products. | High | Check with project owner / SIH guidelines. | UNKNOWN |
| A-05 | Web Speech API is accurate enough for Indian accents. | Need free, low-latency Speech-to-Text. | Browser native. | Medium | Test with team members speaking English/Hindi. | UNKNOWN |
| A-06 | Official SIH requirement supports a focused bidirectional MVP. | Required to bound project scope. | SIH1715 focuses on bridging the communication gap. | High | Project owner confirmation. | VERIFIED |
| A-07 | Stitch implementation details (component states, mobile breakpoints). | We couldn't programmatically inspect all states in Stitch. | Stitch API exported base screens only. | N/A | Manual review by project owner. | UNKNOWN |
| A-08 | Dataset availability and license. | We need data for 30-50 signs. | Existing repos lack clear dataset licenses. | N/A | Source or self-record a new dataset. | UNKNOWN |
| A-09 | Model accuracy for dynamic signs. | We need reliable dynamic sign recognition. | Tested MLP TFLite architecture; accuracy remains unverified independently. | Medium | Train and evaluate an LSTM on custom data. | INDEPENDENT ACCURACY NOT YET VERIFIED |
| A-10 | Hindi support via translation API. | Needed for Hindi -> ISL. | Google Translate API or similar exists. | High | Test API latency and accuracy. | UNKNOWN |
| A-11 | TensorFlow.js TFLite runtime feasibility. | Needed for local browser inference. | Verified via CDN script injection in POC. | High | Load TF.js in browser. | VERIFIED |
