# SIH Requirement Gap Analysis

| Official Requirement (SIH1715) | Existing Repositories | Our MVP (Phase 3) | Full Proposed Version (Future) |
| :--- | :--- | :--- | :--- |
| **Bidirectional System (Audio/Text ↔ ISL)** | No single repo does both perfectly with UI. Repo 3 attempts it but UI is missing. | **Yes** | **Yes** |
| **English → ISL** | Partial (Repo 2, Repo 3) | **Yes** | **Yes** |
| **Hindi → ISL** | Unknown | **Target (via translation)** | **Yes** |
| **ISL → English Text/Speech** | Partial (Repo 1, Repo 3) | **Yes (Text)** | **Yes (Speech)** |
| **ISL → Hindi Text/Speech** | Unknown | **Target (via translation)** | **Yes** |
| **Speech → ISL** | Partial (Repo 2 mentions it) | **Yes (Web API)** | **Yes (Whisper)** |
| **Audio-visual input processing** | Unknown / None | **Limited to Audio/Speech/Camera** | **Yes** |
| **Dynamic signs recognition** | Partial (Repo 3 PointHistory) | **Target (Limited subset)** | **Yes** |
| **Non-manual features (Face/Body)** | None | **No** | **Yes (MediaPipe Holistic)** |
| **Avatar / Animation Output** | Partial (Repo 2 React, Repo 3 SiGML) | **Yes (React Three Fiber)** | **Yes (High fidelity 3D)** |
