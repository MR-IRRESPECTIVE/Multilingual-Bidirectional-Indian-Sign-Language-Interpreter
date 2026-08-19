# Frontend Technical Decision

## Decision: Responsive Web Application via Next.js and Tailwind CSS
For the college-round MVP, we will build a single responsive web application. The primary frontend technology will be Next.js, TypeScript, and Tailwind CSS. We will NOT build a separate Flutter, React Native, or native Android application during the MVP.

## Why We Chose a Web Application (Advantages)
- **Design alignment:** The Stitch design can be implemented directly as a web interface.
- **Styling synergy:** Next.js integrates naturally with Tailwind CSS.
- **Hardware access:** Browser camera APIs can support live ISL recognition, and browser microphone APIs can support speech input.
- **Vision processing:** MediaPipe can be used for browser-based computer vision.
- **Local ML capability:** TensorFlow.js can potentially support local inference. Local inference can reduce network dependency and may reduce inference-related latency. (Note: actual performance vs. server-side inference will be measured later).
- **Demo ease:** A web application is easier to demonstrate during SIH. Judges can access the system through a URL or QR code. No APK installation is required.
- **Platform reach:** One responsive frontend codebase can support desktop, laptop, tablet, and mobile browsers.
- **Parallel development:** Frontend development can proceed independently from backend/ML development using isolated mock states.

## Trade-offs
- **Browser performance:** Browser API and memory constraints may limit how heavy our local TensorFlow.js models can be compared to native apps.
- **Native features:** Web apps have less access to deep native device features (e.g., custom hardware acceleration APIs) than dedicated mobile applications.

## Component Library Strategy
- We will avoid heavy UI component libraries (like MUI or AntD) that conflict with Tailwind, instead opting for raw Tailwind or headless UI components to faithfully reproduce the Stitch design.
- **Icons:** Material Symbols Outlined.
- **Font:** Atkinson Hyperlegible Next.
