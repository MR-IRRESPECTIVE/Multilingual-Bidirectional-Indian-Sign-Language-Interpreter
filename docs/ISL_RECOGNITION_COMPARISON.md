# ISL Recognition Comparison

*(Waiting for live validation results)*

| Metric / Sign | CURRENT SYSTEM (Temporal BiLSTM / Static ANN) | THRISHEIYANUK (MobileNetV2) |
|---------------|-----------------------------------------------|------------------------------|
| **A** | | |
| **B** | | |
| **C** | | |
| **0** | | |
| **HELLO** | Supported (BiLSTM) | Unsupported |
| **THANK YOU** | Supported (BiLSTM) | Unsupported |
| **SORRY** | Supported (BiLSTM) | Unsupported |
| **Lighting Robustness** | | |
| **Background Robustness**| | |
| **Distance Robustness** | | |
| **Temporal Support** | Yes (Sequence modeling) | No (Static Image Only) |
| **FPS / Latency** | | |
| **Input Feature** | 86/42 Geometric Landmarks | 224x224 RGB Image |

## Recommendation

*(Pending user live validation)*

**Option D: Reject (Highly Probable)**
Based purely on the Forensic Audit, the ThrisheiyanUK model is fundamentally incompatible with our dynamic word requirements. It is exclusively a static alphabet/number image classifier (MobileNetV2), which historically suffers from background/lighting bias compared to our geometric landmark approach. We will await actual webcam validation before a final decision.
