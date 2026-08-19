export interface Landmark {
  x: number;
  y: number;
  z?: number;
}

/**
 * Normalizes 21 MediaPipe hand landmarks into 42 flat features.
 * 1. Shifts origin to wrist (landmark 0)
 * 2. Scales coordinates by the maximum absolute coordinate value
 * 3. Flattens to [x0, y0, x1, y1, ... x20, y20]
 */
export function normalizeLandmarks(landmarks: Landmark[]): number[] {
  if (landmarks.length !== 21) {
    throw new Error("Exactly 21 landmarks are required.");
  }

  const wrist = landmarks[0];
  const relative = landmarks.map(lm => ({
    x: lm.x - wrist.x,
    y: lm.y - wrist.y
  }));

  let maxAbs = 0;
  for (const lm of relative) {
    if (Math.abs(lm.x) > maxAbs) maxAbs = Math.abs(lm.x);
    if (Math.abs(lm.y) > maxAbs) maxAbs = Math.abs(lm.y);
  }

  const flattened: number[] = [];
  for (const lm of relative) {
    const x = maxAbs > 0 ? lm.x / maxAbs : 0;
    const y = maxAbs > 0 ? lm.y / maxAbs : 0;
    
    // Validate for NaN/Infinity
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      throw new Error("Invalid coordinate resulting in NaN or Infinity.");
    }
    
    flattened.push(x, y);
  }

  return flattened;
}
export function processUnifiedHands(multiHandLandmarks: Landmark[][], multiHandedness: any[]): number[] | null {
  if (!multiHandLandmarks || multiHandLandmarks.length === 0) return null;

  let leftLandmarks: Landmark[] | null = null;
  let rightLandmarks: Landmark[] | null = null;

  for (let i = 0; i < multiHandLandmarks.length; i++) {
    const handedness = multiHandedness[i]?.label; // "Left" or "Right"
    if (handedness === "Left" && !leftLandmarks) {
      leftLandmarks = multiHandLandmarks[i];
    } else if (handedness === "Right" && !rightLandmarks) {
      rightLandmarks = multiHandLandmarks[i];
    }
  }

  if (!leftLandmarks && !rightLandmarks) return null;

  const leftFeatures = leftLandmarks ? normalizeLandmarks(leftLandmarks) : new Array(42).fill(0.0);
  const rightFeatures = rightLandmarks ? normalizeLandmarks(rightLandmarks) : new Array(42).fill(0.0);

  const leftPresent = leftLandmarks ? 1.0 : 0.0;
  const rightPresent = rightLandmarks ? 1.0 : 0.0;

  const unified = [...leftFeatures, ...rightFeatures, leftPresent, rightPresent];
  return unified;
}
