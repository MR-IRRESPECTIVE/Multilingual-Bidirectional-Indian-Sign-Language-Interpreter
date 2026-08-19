# Data Collection Implementation

## 1. Overview
The internal data collection tool is implemented as an isolated route in the Next.js frontend application (`/collection`). It enables team members to securely capture and export ISL sequence data directly from their browser, eliminating the need for a Python backend during the collection phase.

## 2. Technical Stack
- **Framework:** Next.js / React (TypeScript)
- **Computer Vision:** `@mediapipe/hands` (loaded via CDN or local script)
- **Storage:** Browser `IndexedDB` (using `idb` or native promises)
- **Export:** Native browser Blob and `URL.createObjectURL`

## 3. Preprocessing Implementation [PROPOSED]
The core preprocessing pipeline resides in a TypeScript utility `normalizeLandmarks()`.
```typescript
function normalizeLandmarks(landmarks: {x, y}[]) {
  // 1. Find wrist (landmark 0)
  const wrist = landmarks[0];
  
  // 2. Shift relative to wrist
  const relative = landmarks.map(lm => ({
    x: lm.x - wrist.x,
    y: lm.y - wrist.y
  }));
  
  // 3. Find max absolute value
  let maxAbs = 0;
  for (const lm of relative) {
    if (Math.abs(lm.x) > maxAbs) maxAbs = Math.abs(lm.x);
    if (Math.abs(lm.y) > maxAbs) maxAbs = Math.abs(lm.y);
  }
  
  // 4. Scale and flatten
  const flattened: number[] = [];
  for (const lm of relative) {
    flattened.push(maxAbs > 0 ? lm.x / maxAbs : 0);
    flattened.push(maxAbs > 0 ? lm.y / maxAbs : 0);
  }
  
  return flattened; // Exactly 42 floats
}
```

## 4. Sequence Capture Logic
1. **Buffer Size:** Set to 30 frames by default (configurable).
2. **Recording State:** When `isRecording` is true, every valid `onResults` callback from MediaPipe pushes 1 processed frame into an array.
3. **Completion:** When `buffer.length === 30`, recording automatically halts.
4. **Validation:** Checks that exactly 30 frames were captured, and each frame has exactly 42 finite numerical features.
5. **Dropped Frames:** If MediaPipe loses hand tracking mid-recording, the system does NOT pad. It waits for the hand to return. If this causes unnatural jumps, the user is instructed to manually discard the sample via the UI preview before saving.

## 5. Storage Implementation
We use IndexedDB because `localStorage` has a strict ~5MB limit, which a robust JSON sequence dataset would quickly exceed.
- Database: `ISL_Pilot_DB`
- Object Store: `samples`
- Key: `sample_id`

## 6. Privacy & Ethics Implementation
- No backend API calls are made. 
- A prominent consent banner is displayed at the top of the route.
- Raw video frames (`<canvas>` output) are immediately discarded after landmark extraction. Only geometric abstract floats are saved.
