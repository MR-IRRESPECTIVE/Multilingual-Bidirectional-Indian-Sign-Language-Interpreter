import { normalizeLandmarks } from "./landmark_processing";

// Create synthetic landmarks (21)
const rawLandmarks = Array.from({ length: 21 }, (_, i) => ({
  x: i * 10,
  y: i * 20
}));

try {
  const normalized = normalizeLandmarks(rawLandmarks);
  console.log("Output Length:", normalized.length); // Expected: 42
  console.log("Max val:", Math.max(...normalized)); // Expected: 1.0
  console.log("Min val:", Math.min(...normalized)); // Expected >= -1.0
  console.log("First element (Wrist X):", normalized[0]); // Expected: 0
  console.log("Second element (Wrist Y):", normalized[1]); // Expected: 0
  
  if (normalized.length === 42 && Math.max(...normalized) === 1.0 && normalized[0] === 0) {
    console.log("SUCCESS: Normalization logic verified.");
  } else {
    console.log("FAILURE: Unexpected output.");
  }
} catch (e) {
  console.error(e);
}
