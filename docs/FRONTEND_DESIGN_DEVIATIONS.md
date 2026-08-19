# Frontend Design Deviations

## Current Status
Currently, there are no recorded deviations because implementation has not started.

## Frontend Design Deviations

This document tracks any intentional deviations from the Google Stitch design (`392239906905445162`) along with the technical justification.

| Component / View | Stitch Design | Our Implementation | Justification | Impact |
| :--- | :--- | :--- | :--- | :--- |
| **Tactile ISL / Dictionary** | Stitch included a "Tactile ISL Accessibility Suite" screen. | Implemented as `/learn` (ISL Dictionary) using a simple 3-column responsive card grid. | Tactile ISL requires specific haptic hardware design not feasible for this web MVP. A dictionary directly serves the MVP need to show the 30-50 controlled words. | Changes the feature from haptic feedback to a visual learning tool. |
| **Settings Toggles** | Stitch likely uses custom Material 3 switch components. | Used pure CSS/Tailwind peer-checked toggles. | Avoids introducing heavy UI libraries (like MUI) just for a toggle, keeping the Next.js bundle extremely small for mobile performance. | Minor visual discrepancy compared to exact Material 3 ripple effects. |
| **Avatar Component** | 3D ISL Avatar Canvas. | 2D Tailwind Placeholder (`AvatarPlaceholder.tsx`). | 3D assets are not yet sourced. The placeholder allows frontend development and state management (mock data) to proceed unblocked. | Temporary deviation; will be replaced in the ML/Backend integration phase. |

## Policy on Deviations
- We will strictly follow the provided Stitch project (`392239906905445162`).
- We will NOT redesign the Stitch UI.
- We will NOT invent screens that are not present.

If technical limitations (such as MediaPipe rendering constraints or 3D Avatar canvas limitations) require deviating from the provided Stitch layout, those deviations MUST be documented here and tagged as **PROPOSED ADDITION** or **PROPOSED DEVIATION**, awaiting project owner approval.
