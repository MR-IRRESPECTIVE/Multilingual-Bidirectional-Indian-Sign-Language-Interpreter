# Repository Integration Analysis
We reduce code-reuse and licensing risk by implementing the system independently, while still requiring verification of datasets, assets, models, and third-party dependencies.

| Component | Repo 1 (Indian-Sign-Language-Detection) | Repo 2 (SignKit) | Repo 3 (Bidirectional-ISL-Translator) | Our Decision (PROPOSED) |
| :--- | :--- | :--- | :--- | :--- |
| **ISL recognition** | Yes (Static alphabets/numbers) | No | Yes (Basic words & alphabets) | Use Repo 3's approach as a baseline for ISL recognition. |
| **MediaPipe** | Yes (Hand landmarks only) | No | Yes (Hand landmarks) | Rebuild using MediaPipe, potentially adding Pose for dynamic signs. |
| **Gesture model** | FNN (Keras) | No | TFLite KeyPoint & PointHistory | Use TFLite approach for faster edge/web inference. |
| **Dynamic gestures** | No | No | Partial (PointHistoryClassifier) | Explore extending Repo 3's PointHistory for dynamic signs. |
| **Face** | No | No | No | Exclude from MVP, add in Future Scope. |
| **Pose** | No | No | No | Investigate MediaPipe Holistic for Phase 2. |
| **Speech-to-text** | No | Yes (Mentioned in paper/API) | No | Integrate browser-based Web Speech API or Whisper. |
| **NLP** | No | No (Direct mapping) | Yes (SpaCy en_core_web_sm) | Use Repo 3's SpaCy logic as a baseline for grammar. |
| **ISL grammar** | No | No | Yes (SOV restructuring) | Refine Repo 3's rules. |
| **ISL gloss** | No | No | Yes (Words/letters split) | Adopt Repo 3's fallback (fingerspelling for unknown words). |
| **Avatar** | No | Yes (React Three Fiber / JSON animations) | Yes (Mentioned SiGML, but missing UI) | Rebuild React Avatar viewer (Repo 2's concept, our implementation). |
| **Sign videos** | No | No | No | Use Avatar instead of Sign videos for MVP to save space. |
| **Text-to-speech** | No | No | No | Add using Browser APIs for MVP. |
| **Frontend** | No | Yes (React) | No (Empty Web-UI folder) | Build our own React/Next.js frontend. |
| **Backend** | No | Yes (NodeJS API) | Yes (Flask & FastAPI) | Use FastAPI (Python) to serve ML & NLP efficiently. |
| **Database** | No | Yes (MongoDB assumed/implied) | No | SQLite/PostgreSQL if user profiles are needed (Phase 2). |
