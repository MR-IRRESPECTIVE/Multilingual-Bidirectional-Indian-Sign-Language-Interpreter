# Team Roles (Six Members)

## Member 1: Computer Vision & ISL Recognition
- **Responsibility:** Implementing MediaPipe hand/pose tracking and extracting coordinates.
- **Deliverables:** A robust pipeline that takes a webcam frame and outputs a normalized 1D array of landmarks.
- **Dependencies:** None.
- **Skills:** Python, OpenCV, MediaPipe.

## Member 2: Machine Learning & Modeling
- **Responsibility:** Creating, training, and converting the ISL classification models (MLP/LSTM).
- **Deliverables:** A trained TFLite/TF.js model that takes landmarks and outputs a predicted sign class.
- **Dependencies:** Relies on Member 1 for data extraction format.
- **Skills:** TensorFlow, Keras, Data preprocessing.

## Member 3: NLP & Translation Logic
- **Responsibility:** Building the English/Hindi text to ISL Gloss grammar converter.
- **Deliverables:** Python functions (using SpaCy) that convert "What are you doing?" to "YOU DOING WHAT?".
- **Dependencies:** None.
- **Skills:** Python, SpaCy, Linguistics.

## Member 4: Backend & APIs
- **Responsibility:** Setting up the FastAPI server, connecting NLP models, and handling data routes.
- **Deliverables:** RESTful APIs for the frontend to consume.
- **Dependencies:** Relies on Member 3 for NLP logic.
- **Skills:** Python, FastAPI, API Design.

## Member 5: Frontend & Avatar Integration
- **Responsibility:** Building the Web UI and integrating the 3D Avatar (Three.js/React Three Fiber).
- **Deliverables:** A working web app where users can see the Avatar animate based on text input.
- **Dependencies:** Relies on Member 4 for API and Member 3 for ISL Gloss.
- **Skills:** React, Three.js, WebGL.

## Member 6: UI/UX & Audio Services (Speech)
- **Responsibility:** Designing the app interface, user experience, and integrating Speech-to-Text / Text-to-Speech APIs.
- **Deliverables:** Responsive design, clean UI, and working microphone/speaker integrations.
- **Dependencies:** None.
- **Skills:** CSS/Tailwind, JavaScript, Web Speech API.
