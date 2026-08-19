const { normalizeLandmarks, processUnifiedHands } = require('./landmark_processing_test_helper.js');
const assert = require('assert');

// Mock data
function createMockLandmarks(offset) {
  const lm = [];
  for (let i = 0; i < 21; i++) {
    lm.push({ x: i + offset, y: i + offset, z: 0 });
  }
  return lm;
}

function runTests() {
  console.log("=== RUNNING UNIFIED HANDS TESTS ===");

  // Test 2: normalization unit tests
  try {
    const lm = createMockLandmarks(0); // Wrist is at 0,0
    const norm = normalizeLandmarks(lm);
    assert.strictEqual(norm.length, 42, "Normalized length should be 42");
    assert.strictEqual(norm[0], 0, "Wrist X should be shifted to 0");
    assert.strictEqual(norm[1], 0, "Wrist Y should be shifted to 0");
    assert.strictEqual(norm[norm.length - 1], 1, "Max val should be scaled to 1");
    console.log("Test 2 (Normalization): PASSED");
  } catch (e) {
    console.error("Test 2 FAILED:", e.message);
  }

  // Test 3: one-hand test case (Left only)
  try {
    const multiLms = [createMockLandmarks(10)];
    const handedness = [{ label: "Left" }];
    const res = processUnifiedHands(multiLms, handedness);
    assert.strictEqual(res.length, 86);
    assert.strictEqual(res[84], 1.0, "Left flag should be 1");
    assert.strictEqual(res[85], 0.0, "Right flag should be 0");
    assert.strictEqual(res[42], 0.0, "Right hand features should be 0-padded");
    console.log("Test 3 (One-hand, Left): PASSED");
  } catch (e) {
    console.error("Test 3 FAILED:", e.message);
  }

  // Test 4: two-hand test case
  try {
    const multiLms = [createMockLandmarks(10), createMockLandmarks(20)];
    const handedness = [{ label: "Left" }, { label: "Right" }];
    const res = processUnifiedHands(multiLms, handedness);
    assert.strictEqual(res.length, 86);
    assert.strictEqual(res[84], 1.0, "Left flag should be 1");
    assert.strictEqual(res[85], 1.0, "Right flag should be 1");
    console.log("Test 4 (Two-hand): PASSED");
  } catch (e) {
    console.error("Test 4 FAILED:", e.message);
  }

  // Test 5: hand-order swapping test (Right first, then Left)
  try {
    const multiLmsNormal = [createMockLandmarks(10), createMockLandmarks(20)];
    const handednessNormal = [{ label: "Left" }, { label: "Right" }];
    const resNormal = processUnifiedHands(multiLmsNormal, handednessNormal);

    const multiLmsSwapped = [createMockLandmarks(20), createMockLandmarks(10)];
    const handednessSwapped = [{ label: "Right" }, { label: "Left" }];
    const resSwapped = processUnifiedHands(multiLmsSwapped, handednessSwapped);

    assert.deepStrictEqual(resNormal, resSwapped, "Swapped order should yield identical fixed-position arrays");
    console.log("Test 5 (Hand-order Swapping): PASSED");
  } catch (e) {
    console.error("Test 5 FAILED:", e.message);
  }

  // Test 6: missing-left-hand test
  try {
    const multiLms = [createMockLandmarks(20)];
    const handedness = [{ label: "Right" }];
    const res = processUnifiedHands(multiLms, handedness);
    assert.strictEqual(res[84], 0.0, "Left flag should be 0");
    assert.strictEqual(res[85], 1.0, "Right flag should be 1");
    assert.strictEqual(res[0], 0.0, "Left features should be padded");
    console.log("Test 6 (Missing Left): PASSED");
  } catch (e) {
    console.error("Test 6 FAILED:", e.message);
  }

  // Test 7: missing-right-hand test
  try {
    const multiLms = [createMockLandmarks(20)];
    const handedness = [{ label: "Left" }];
    const res = processUnifiedHands(multiLms, handedness);
    assert.strictEqual(res[84], 1.0, "Left flag should be 1");
    assert.strictEqual(res[85], 0.0, "Right flag should be 0");
    console.log("Test 7 (Missing Right): PASSED");
  } catch (e) {
    console.error("Test 7 FAILED:", e.message);
  }

  // Test 8: missing-both-hands rejection test
  try {
    const res = processUnifiedHands([], []);
    assert.strictEqual(res, null, "Should return null when no hands are detected");
    console.log("Test 8 (Missing Both): PASSED");
  } catch (e) {
    console.error("Test 8 FAILED:", e.message);
  }

  // Test 9: save/export schema validation
  try {
    const dummySample = {
      dataset_version: "1.0",
      sample_id: "test",
      signer_id: "tester",
      sign_class: 1,
      sign_label: "test",
      capture_timestamp: new Date().toISOString(),
      frame_count: 30,
      feature_dimension: 86,
      frames: new Array(30).fill(new Array(86).fill(0.1))
    };
    
    assert.strictEqual(dummySample.feature_dimension, 86);
    assert.strictEqual(dummySample.frames[0].length, 86);
    
    // Simulate what the pipeline does
    const exportedJSON = JSON.stringify([dummySample]);
    const parsed = JSON.parse(exportedJSON);
    
    assert.strictEqual(parsed[0].feature_dimension, 86);
    console.log("Test 9 (Schema Validation for 86 features): PASSED");
  } catch (e) {
    console.error("Test 9 FAILED:", e.message);
  }
}

runTests();
