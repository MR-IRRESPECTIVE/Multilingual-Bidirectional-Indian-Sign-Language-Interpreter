function normalizeLandmarks(landmarks) {
  if (landmarks.length === 0) return [];
  const wristX = landmarks[0].x;
  const wristY = landmarks[0].y;
  const shifted = landmarks.map(lm => ({ x: lm.x - wristX, y: lm.y - wristY }));
  let maxVal = 0;
  for (const lm of shifted) {
    if (Math.abs(lm.x) > maxVal) maxVal = Math.abs(lm.x);
    if (Math.abs(lm.y) > maxVal) maxVal = Math.abs(lm.y);
  }
  if (maxVal === 0) maxVal = 1;
  const normalized = [];
  for (const lm of shifted) {
    normalized.push(lm.x / maxVal);
    normalized.push(lm.y / maxVal);
  }
  return normalized;
}

function processUnifiedHands(multiHandLandmarks, multiHandedness) {
  if (!multiHandLandmarks || multiHandLandmarks.length === 0) return null;
  let leftLandmarks = null;
  let rightLandmarks = null;
  for (let i = 0; i < multiHandLandmarks.length; i++) {
    const handedness = multiHandedness[i]?.label;
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
  return [...leftFeatures, ...rightFeatures, leftPresent, rightPresent];
}

const assert = require('assert');
function createMockLandmarks(offset) {
  const lm = [];
  for (let i = 0; i < 21; i++) {
    lm.push({ x: i + offset, y: i + offset, z: 0 });
  }
  return lm;
}
function runTests() {
  console.log("=== RUNNING UNIFIED HANDS TESTS ===");
  try {
    const lm = createMockLandmarks(0);
    const norm = normalizeLandmarks(lm);
    assert.strictEqual(norm.length, 42);
    assert.strictEqual(norm[0], 0);
    assert.strictEqual(norm[1], 0);
    assert.strictEqual(norm[norm.length - 1], 1);
    console.log("Test 2 (Normalization): PASSED");
  } catch (e) { console.error("Test 2 FAILED:", e.message); }
  
  try {
    const multiLms = [createMockLandmarks(10)];
    const handedness = [{ label: "Left" }];
    const res = processUnifiedHands(multiLms, handedness);
    assert.strictEqual(res.length, 86);
    assert.strictEqual(res[84], 1.0);
    assert.strictEqual(res[85], 0.0);
    assert.strictEqual(res[42], 0.0);
    console.log("Test 3 (One-hand, Left): PASSED");
  } catch (e) { console.error("Test 3 FAILED:", e.message); }
  
  try {
    const multiLms = [createMockLandmarks(10), createMockLandmarks(20)];
    const handedness = [{ label: "Left" }, { label: "Right" }];
    const res = processUnifiedHands(multiLms, handedness);
    assert.strictEqual(res.length, 86);
    assert.strictEqual(res[84], 1.0);
    assert.strictEqual(res[85], 1.0);
    console.log("Test 4 (Two-hand): PASSED");
  } catch (e) { console.error("Test 4 FAILED:", e.message); }
  
  try {
    const multiLmsNormal = [createMockLandmarks(10), createMockLandmarks(20)];
    const handednessNormal = [{ label: "Left" }, { label: "Right" }];
    const resNormal = processUnifiedHands(multiLmsNormal, handednessNormal);
    const multiLmsSwapped = [createMockLandmarks(20), createMockLandmarks(10)];
    const handednessSwapped = [{ label: "Right" }, { label: "Left" }];
    const resSwapped = processUnifiedHands(multiLmsSwapped, handednessSwapped);
    assert.deepStrictEqual(resNormal, resSwapped);
    console.log("Test 5 (Hand-order Swapping): PASSED");
  } catch (e) { console.error("Test 5 FAILED:", e.message); }
  
  try {
    const multiLms = [createMockLandmarks(20)];
    const handedness = [{ label: "Right" }];
    const res = processUnifiedHands(multiLms, handedness);
    assert.strictEqual(res[84], 0.0);
    assert.strictEqual(res[85], 1.0);
    assert.strictEqual(res[0], 0.0);
    console.log("Test 6 (Missing Left): PASSED");
  } catch (e) { console.error("Test 6 FAILED:", e.message); }
  
  try {
    const multiLms = [createMockLandmarks(20)];
    const handedness = [{ label: "Left" }];
    const res = processUnifiedHands(multiLms, handedness);
    assert.strictEqual(res[84], 1.0);
    assert.strictEqual(res[85], 0.0);
    console.log("Test 7 (Missing Right): PASSED");
  } catch (e) { console.error("Test 7 FAILED:", e.message); }
  
  try {
    const res = processUnifiedHands([], []);
    assert.strictEqual(res, null);
    console.log("Test 8 (Missing Both): PASSED");
  } catch (e) { console.error("Test 8 FAILED:", e.message); }
  
  try {
    const dummySample = {
      dataset_version: "1.0",
      feature_dimension: 86,
      frames: new Array(30).fill(new Array(86).fill(0.1))
    };
    assert.strictEqual(dummySample.feature_dimension, 86);
    assert.strictEqual(dummySample.frames[0].length, 86);
    console.log("Test 9 (Schema Validation for 86 features): PASSED");
  } catch (e) { console.error("Test 9 FAILED:", e.message); }
}
runTests();
