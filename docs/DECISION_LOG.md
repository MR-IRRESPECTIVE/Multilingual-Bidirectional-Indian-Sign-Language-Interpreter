 ## DEC-006: Custom ISL Dataset and Model
 - **Context:** The Phase 2B forensic audit proved the 41-class ISL model from the reference repository is unreproducible (missing 41-class dataset, missing checkpoints, undocumented architecture) and has no license.
 - **Decision:** We will build our own, legally clean MVP dataset consisting of 10 core ISL words, and train our own model from scratch.
 - **Rationale:** Attempting to force the undocumented third-party model to work carries high risk of failure and potential IP issues. Collecting a small, high-quality 10-word dataset gives us complete control, traceability, and confidence in the evaluation metrics. Because 8 of the 10 words are dynamic, we will use a 1D CNN on a 30-frame window rather than the static MLP originally planned.

 ## DEC-007: Pilot-First Dataset Collection
 - **Context:** Full scale data collection requires significant team effort.
 - **Decision:** We will run a 180-sample pilot (3 signers, 3 signs, 20 samples) before launching full-scale collection.
 - **Rationale:** We need to validate the data schema, landmark preprocessing, temporal representation, storage (IndexedDB), and collection workflow before spending significant team time on large-scale data collection.

**DEC-001**
- **Date:** 2024-10-XX (Current)
- **Decision:** Do NOT merge the three existing repositories directly. Build a fresh codebase.
- **Context:** The repositories have conflicting architectures (MERN vs Flask vs FastAPI), unknown licensing, and varying levels of completeness (Repo 3's UI is missing).
- **Options considered:** 
  1) Fork Repo 3 and fix it. 
  2) Build from scratch drawing inspiration.
- **Chosen option:** 2) Build from scratch.
- **Reason:** Ensures clean architecture, eliminates licensing risks, and guarantees the team actually understands every component.
- **Evidence:** Repo 3 Web-UI is empty; Repo 1 & 2 lack licenses.
- **Trade-offs:** Higher initial development time, but lower technical debt and integration headaches later.
- **Reversible?:** No (Once development starts).
- **Owner:** Lead Software Architect.

**DEC-002**
- **Date:** 2024-10-XX (Current)
- **Decision:** Use a controlled vocabulary of 30-50 words for the MVP.
- **Context:** ISL has thousands of signs. We do not have the dataset or time to train a comprehensive model.
- **Options considered:** 1) Full ISL dictionary. 2) Controlled subset.
- **Chosen option:** 2) Controlled subset.
- **Reason:** Allows us to focus on the end-to-end architecture and Bidirectional flow rather than data entry.
- **Evidence:** Custom ML models trained on small datasets (like Repo 3) perform well for demos.
- **Trade-offs:** Limited usefulness in real-world scenarios initially.
- **Reversible?:** Yes (Can add more words later).
- **Owner:** Lead Software Architect.

**DEC-002**
- **Title:** Responsive Next.js Web Application as MVP Frontend
- **Decision:** Build one responsive Next.js web application for the college-round MVP instead of maintaining a separate native mobile application.
- **Reason:** 
  - Stitch compatibility
  - faster development
  - single frontend codebase
  - browser camera/microphone support
  - potential local MediaPipe/TensorFlow.js inference
  - easier SIH demonstration
  - mobile/tablet/desktop support through responsive design
  - reduced frontend development overhead
- **Trade-offs:** 
  - browser performance varies by device
  - browser API limitations
  - local ML compatibility must be tested
  - native device features may be less accessible than in a dedicated mobile application
- **Status:** APPROVED FOR MVP ARCHITECTURE
  
**DEC-003**
- **Title:** Avatar Placeholder Implementation
- **Decision:** Use an HTML/Tailwind-based Avatar Placeholder component during the initial frontend phase instead of initializing React Three Fiber immediately.
- **Reason:** 
  - Allows UI development to proceed without being blocked by 3D asset sourcing or WebGL performance debugging.
  - Clearly visually demarcates where the 3D canvas will eventually be mounted.
  - Can easily test subtitle syncing (activeGloss) with mock data before dealing with 3D animation keys.
- **Trade-offs:** The true performance impact of the Avatar on mobile devices cannot be tested until Phase 3.
- **Status:** APPROVED (Temporary for Mock Phase)

**DEC-004**
- **Title:** Browser-side TFLite Inference for ISL Recognition (Option A)
- **Decision:** Use MediaPipe JS + browser-side TFLite inference using the TensorFlow.js TFLite runtime with WebAssembly, rather than streaming frames or landmarks to the FastAPI backend.
- **Reason:** 
  - Browser-side inference removes the need to transmit camera frames to the backend for recognition and reduces network dependency.
  - Reduces backend server costs and complexity significantly.
  - Python 3.14 on the host environment prevented TensorFlow installation, proving backend ML deployment can be brittle compared to a WebGL/WASM browser runtime.
  - TFLite models are typically <1MB and easy to serve statically.
- **Trade-offs:** 
  - Moves memory and computation load to the user's device. 
  - Low-end mobile devices may experience browser tab crashes if WebAssembly/WebGL memory limits are exceeded.
- **Status:** APPROVED FOR PHASE 2A

**DEC-005**
- **Title:** Native TensorFlow.js over TFLite WASM
- **Decision:** Convert the HDF5 Keras baseline model directly to native TensorFlow.js format rather than using the TFLite WASM runtime in the browser.
- **Reason:** The older tfjs-tflite package does not support the newer FULLY_CONNECTED Version 12 operator generated by modern TensorFlow. Native TFJS eliminates versioning conflicts, loads faster, and avoids WASM C++ interpreter limitations.
- **Trade-offs:** Requires an upfront conversion step using tensorflowjs_converter, but improves long-term frontend stability.
- **Status:** APPROVED FOR PHASE 2B
