# Security and Privacy

## Camera and Microphone Data
The browser camera and microphone contain highly sensitive information. The frontend must adhere strictly to the following rules:
- **Explicit Permissions:** Request camera and microphone permissions explicitly through browser APIs.
- **Explain Purpose:** Display a clear, user-friendly UI explanation of why permissions are required *before* triggering the browser prompt.
- **Graceful Termination:** Stop the camera track immediately when leaving the camera/recognition mode. Stop the microphone immediately when recording ends.
- **No Raw Video Uploads:** Avoid unnecessary raw-video uploads to the backend. Video frames (MediaPipe) must be processed LOCALLY on the client device.
- **No Storage:** Avoid storing raw camera footage or microphone recordings unless explicitly required by a documented feature (and explicitly opted-into by the user).

## Data Collection
- We will NOT collect or store personal user videos or audio recordings.

## API Security
- Any external APIs (if we use external translation services) must have their API keys secured in environment variables (`.env`) on the backend and NEVER hardcoded in the frontend or public repositories.
- Backend APIs (FastAPI) must implement basic rate limiting to prevent abuse.
