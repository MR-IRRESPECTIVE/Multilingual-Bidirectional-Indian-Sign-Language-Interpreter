# Licensing and Attribution

Our default engineering policy is: "We will write our own implementation unless reuse rights are explicitly verified."

## Repository 1 (Indian-Sign-Language-Detection)
- **A. Direct code reuse:** LICENSE NOT FOUND (Cannot reuse code directly).
- **B. Architectural/reference learning:** REUSE REQUIRES ATTRIBUTION (Algorithm concepts can be studied).
- **C. Dataset reuse (Kaggle ISL):** LICENSE UNCLEAR (Must verify Kaggle terms before use).
- **D. Model reuse:** LICENSE NOT FOUND (Cannot reuse model file).

## Repository 2 (SignKit)
- **A. Direct code reuse:** LICENSE NOT FOUND.
- **B. Architectural/reference learning:** REUSE REQUIRES ATTRIBUTION.
- **E. Animation/avatar assets:** LICENSE NOT FOUND (Cannot reuse 3D models/JSON animations).

## Repository 3 (Bidirectional-Indian-Sign-Language-Translator)
- **A. Direct code reuse:** LICENSE NOT FOUND.
- **B. Architectural/reference learning:** REUSE REQUIRES ATTRIBUTION (SpaCy rules and MediaPipe classifier pipeline can be studied).
- **C. Dataset reuse:** LICENSE NOT FOUND.
- **D. Model reuse:** LICENSE NOT FOUND.
- **E. Animation/avatar assets:** Missing from repository entirely.

## F. Third-Party Dependencies
- **MediaPipe:** VERIFIED LICENSE (Apache License 2.0).
- **TensorFlow / Keras:** VERIFIED LICENSE (Apache License 2.0).
- **React / Next.js:** VERIFIED LICENSE (MIT License).
- **FastAPI / Flask:** VERIFIED LICENSE (MIT / BSD License).
- **SpaCy:** VERIFIED LICENSE (MIT License).

## G. Documentation/Research Ideas
- Standard NLP SOV mapping rules and MediaPipe skeletal extraction concepts are part of the public scientific domain, but specific heuristic implementations require REUSE REQUIRES ATTRIBUTION.

## Action Items
- We must build our codebase from scratch to avoid copyright infringement of the three un-licensed repositories. We can use their documented architectures as inspiration (which is allowed under general software design principles), but not their source code.
- We must find an open-source 3D Avatar (e.g., ReadyPlayerMe or Mixamo, checking their specific terms of service for hackathon use).
