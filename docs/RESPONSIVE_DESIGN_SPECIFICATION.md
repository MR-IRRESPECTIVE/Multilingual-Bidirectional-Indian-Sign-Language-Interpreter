# Responsive Design Specification

## Stitch Source
- **Stitch Project ID:** 392239906905445162 (Primary Visual Source of Truth)

## Mobile-First Responsiveness
Even though the Stitch project exported DESKTOP metrics, the MVP will be designed **mobile-first**. The same codebase must support:
- **Mobile (Compact, touch-friendly layout):** Minimum 360px and 390px widths. Camera controls must be touch-friendly. The conversation interface must not break on narrow screens.
- **Tablet (Adaptive layout):** Minimum 768px width. Two-column or adaptive stacked layouts depending on the active mode.
- **Desktop/Laptop (Large interface):** 1024px+ and 2560px layouts as provided in Stitch.

We will not create separate desktop and mobile applications. 

## Component Behavior
- Buttons must have appropriate touch targets (min 44px recommended for mobile).
- Text must remain readable across all breakpoints without horizontal scrolling.
- The UI must adapt to ensure that the Camera preview and Chat views do not conflict for screen real estate on mobile devices.
