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

/**
 * EXACT REPRODUCTION of the Atharv/Maitree 42-feature static preprocessing.
 * 
 * Mathematical transformation:
 * 1. Takes MediaPipe normalized [0,1] coordinates.
 * 2. Multiplies by imageWidth and imageHeight, truncates to integers (Absolute Pixel Space).
 *    THIS IS CRITICAL because W and H are typically 640x480 (4:3 aspect ratio).
 *    If we don't multiply, the aspect ratio is squished, changing spatial relationships.
 * 3. Subtracts wrist coordinate (landmark 0) from all landmarks.
 * 4. Flattens into a 1D array of length 42 ([x0, y0, x1, y1, ...]).
 * 5. Divides all values by the maximum absolute value in the flattened array.
 */
export function processStatic42Features(
  landmarks: Landmark[],
  imageWidth: number = 640,
  imageHeight: number = 480
): number[] {
  if (!landmarks || landmarks.length !== 21) {
    throw new Error("Exactly 21 landmarks are required.");
  }

  // 1. Convert to absolute pixel coordinates
  const pixelPts = landmarks.map(lm => [
    Math.min(Math.floor(lm.x * imageWidth), imageWidth - 1),
    Math.min(Math.floor(lm.y * imageHeight), imageHeight - 1)
  ]);

  // 2. Wrist centering
  const baseX = pixelPts[0][0];
  const baseY = pixelPts[0][1];

  for (let i = 0; i < pixelPts.length; i++) {
    pixelPts[i][0] -= baseX;
    pixelPts[i][1] -= baseY;
  }

  // 3. Flatten
  const flat: number[] = [];
  for (let i = 0; i < pixelPts.length; i++) {
    flat.push(pixelPts[i][0]);
    flat.push(pixelPts[i][1]);
  }

  // 4. Max-absolute normalization
  let maxAbs = 0;
  for (let i = 0; i < flat.length; i++) {
    const absVal = Math.abs(flat[i]);
    if (absVal > maxAbs) {
      maxAbs = absVal;
    }
  }

  if (maxAbs > 0) {
    for (let i = 0; i < flat.length; i++) {
      flat[i] /= maxAbs;
    }
  }

  return flat;
}

/**
 * processStatic42FeaturesFlipped:
 * EXACT reproduction of the legacy training domain (Atharv/Maitree).
 * Legacy code used `cv.flip(image, 1)` BEFORE sending the frame to MediaPipe.
 * Since MediaPipe outputs X from 0 (left) to 1 (right), a flipped image
 * causes MediaPipe to output `1.0 - x` for every X coordinate.
 * This function applies `1.0 - x` to simulate the flipped domain, ensuring
 * physical right hands are processed as they were during training.
 */
export function processStatic42FeaturesFlipped(
  landmarks: Landmark[],
  imageWidth: number = 640,
  imageHeight: number = 480
): number[] {
  if (!landmarks || landmarks.length !== 21) {
    throw new Error("Exactly 21 landmarks are required.");
  }

  // 1. Simulate the cv.flip(image, 1) by inverting X
  const pixelPts = landmarks.map(lm => [
    Math.min(Math.floor((1.0 - lm.x) * imageWidth), imageWidth - 1),
    Math.min(Math.floor(lm.y * imageHeight), imageHeight - 1)
  ]);

  // 2. Wrist centering
  const baseX = pixelPts[0][0];
  const baseY = pixelPts[0][1];

  for (let i = 0; i < pixelPts.length; i++) {
    pixelPts[i][0] -= baseX;
    pixelPts[i][1] -= baseY;
  }

  // 3. Flatten
  const flat: number[] = [];
  for (let i = 0; i < pixelPts.length; i++) {
    flat.push(pixelPts[i][0]);
    flat.push(pixelPts[i][1]);
  }

  // 4. Max-absolute normalize
  let maxAbs = 0;
  for (let i = 0; i < flat.length; i++) {
    const val = Math.abs(flat[i]);
    if (val > maxAbs) {
      maxAbs = val;
    }
  }

  if (maxAbs > 0) {
    for (let i = 0; i < flat.length; i++) {
      flat[i] = flat[i] / maxAbs;
    }
  }

  return flat;
}

