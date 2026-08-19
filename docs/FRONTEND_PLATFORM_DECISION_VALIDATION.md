# Frontend Platform Decision Validation

## 1. Final Frontend Decision
We will build a single responsive web application using **Next.js, TypeScript, and Tailwind CSS**.

## 2. Why we chose it
- It enables direct implementation of the Google Stitch design (`392239906905445162`) visually and architecturally.
- It provides a single codebase capable of serving both mobile and desktop users via responsive design.
- The web platform inherently supports access to the device camera and microphone through standard browser APIs.
- Next.js integrates seamlessly with Tailwind CSS.
- It avoids the overhead of managing dual native/web codebases during a time-constrained hackathon.

## 3. Alternatives considered
- **Flutter / React Native:** Rejected for MVP. Building and distributing native applications adds significant setup, compilation, and review overhead compared to a instantly accessible web URL.
- **Pure React (Create React App/Vite):** Rejected in favor of Next.js for better routing, server-side rendering options (if needed), and cleaner architectural boundaries (e.g. API routes).

## 4. Advantages
- Web applications are vastly easier to demonstrate to SIH judges (requires only a QR code or URL). No APK installation is needed.
- Frontend development can proceed entirely independently of backend and ML tasks via mocked states.
- Local browser inference (MediaPipe JS and TensorFlow.js) is feasible and highly portable.

## 5. Trade-offs
- The performance of browser-based ML models varies heavily depending on the user's specific device capability and browser engine.
- Deep native features or persistent background processes are not available.

## 6. Technical Risks
- **Local Inference:** It is currently *proposed* to run MediaPipe and TensorFlow.js locally. This must be validated experimentally. If memory constraints or execution speeds are unacceptable, we must revert to a backend streaming approach.
- **Mobile Browsers:** Mobile Safari and Mobile Chrome have different constraints on Camera permissions and WebGL resources, which could break the 3D Avatar or MediaPipe tracking.

## 7. Validation required
- **ML Performance:** We must test MediaPipe and the exported TFLite/TF.js models inside a mobile browser to ensure >24 FPS inference.
- **3D Avatar Rendering:** We must test React Three Fiber on mobile to ensure it doesn't crash the browser tab due to memory limits.
- **Microphone APIs:** Test Web Speech API accuracy on Indian-accented English and Hindi.

## 8. Future mobile strategy
- A native application (e.g., React Native, Flutter) or a Progressive Web App (PWA) wrapper (e.g., Capacitor) remains a viable future option after the MVP successfully demonstrates the core bidirectional logic.

## 9. Final architecture diagram
```text
+-----------------------------------------------------------+
|                  FRONTEND (Next.js / React)               |
|                                                           |
|  [ Text/Speech Input ]             [ 3D Avatar Output ]   |
|            |                                ^             |
|            v                                |             |
|  (Send via REST API)           (Play JSON/GLTF Animation) |
|                                                           |
|-----------------------------------------------------------|
|  [ WebCam Video Feed ]             [ Text/Speech Output ] |
|            |                                ^             |
|            v                                |             |
|  (MediaPipe JS + TF.js)            (Display on screen)    |
|   (Local Inference)                                       |
+-----------------------------------------------------------+
             |                                ^
        (HTTP POST)                     (HTTP Response)
             v                                |
+-----------------------------------------------------------+
|                   BACKEND (FastAPI / Python)              |
|                                                           |
|                 [ NLP Processing (SpaCy) ]                |
|      (English/Hindi -> ISL Grammar/Gloss Mapping)         |
+-----------------------------------------------------------+
```

## 10. Open questions
- Which specific 30-50 words will form the MVP dictionary?
- If local TF.js inference fails the validation tests, what is the exact fallback API contract for video streaming to FastAPI? (Currently undefined).
