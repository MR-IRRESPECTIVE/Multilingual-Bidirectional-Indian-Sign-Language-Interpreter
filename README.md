# Multilingual Bidirectional Indian Sign Language Interpreter (ISL)

This repository contains the full-stack application for the Indian Sign Language (ISL) Interpreter, featuring live camera-based ISL-to-text recognition and text-to-ISL 3D avatar animation.

## 🚀 Presentation Setup Guide

The project consists of two parts that must run simultaneously: a Python backend (FastAPI) and a Next.js frontend.

### Prerequisites
- **Node.js** (v18+ recommended)
- **Python 3.12**

---

### Step 1: Start the Backend (API & ML Models)

The backend runs the machine learning models and translation endpoints.

1. Open a new terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On Mac/Linux:
   source venv/bin/activate
   ```

3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the FastAPI server:
   ```bash
   uvicorn app.main:app --reload
   ```
   *The backend will run on `http://localhost:8000`*

---

### Step 2: Start the Frontend (UI)

The frontend contains the web interface, the camera capture, and the 3D SignKit player.

1. Open a **second** terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the Next.js development server:
   ```bash
   npm run dev
   ```

4. Open the application:
   Go to [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🧭 Key Features
- **Sign → Text (Camera):** Navigate to `/conversation` to use live webcam recognition.
- **Text → Sign (Avatar):** Navigate to `/translate` to convert text sentences to 3D avatar animations.
- **Dictionary:** Navigate to `/dictionary` to explore the ISL vocabulary library.
- **Settings:** Navigate to `/settings` for high contrast, subtitle toggles, and signing speed controls.

*Note: All data processing happens locally for privacy and speed. Ensure your browser has camera permissions enabled.*
