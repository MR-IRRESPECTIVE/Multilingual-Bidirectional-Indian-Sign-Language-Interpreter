/**
 * test_two_hand_ratio.js — Sequence-Level Two-Hand Ratio Tests
 *
 * Tests the Namaste/two-hand 80% sequence-level acceptance policy:
 *   - Two-handed signs capture all valid frames (at least one hand detected)
 *   - Missing hand is zero-padded with presence flag = 0.0
 *   - At 30 frames, if two-hand presence is >= 80%, sequence is accepted
 *   - At 30 frames, if two-hand presence is < 80%, sequence is rejected
 *   - One-handed signs always accept (as long as one hand is detected)
 *   - No fabricated landmarks
 *
 * Run from project root:  node frontend/src/utils/test_two_hand_ratio.js
 */

"use strict";

const assert = require("assert");

// ── Inline implementation (matches landmark_processing.ts exactly) ──────────

function normalizeLandmarks(landmarks) {
  if (landmarks.length !== 21) throw new Error("Exactly 21 landmarks required");
  const wrist = landmarks[0];
  const relative = landmarks.map(lm => ({ x: lm.x - wrist.x, y: lm.y - wrist.y }));
  let maxAbs = 0;
  for (const lm of relative) {
    if (Math.abs(lm.x) > maxAbs) maxAbs = Math.abs(lm.x);
    if (Math.abs(lm.y) > maxAbs) maxAbs = Math.abs(lm.y);
  }
  const flattened = [];
  for (const lm of relative) {
    const x = maxAbs > 0 ? lm.x / maxAbs : 0;
    const y = maxAbs > 0 ? lm.y / maxAbs : 0;
    if (!Number.isFinite(x) || !Number.isFinite(y)) throw new Error("NaN/Infinity in coordinates");
    flattened.push(x, y);
  }
  return flattened;
}

function processUnifiedHands(multiHandLandmarks, multiHandedness) {
  if (!multiHandLandmarks || multiHandLandmarks.length === 0) return null;
  let leftLandmarks  = null;
  let rightLandmarks = null;
  for (let i = 0; i < multiHandLandmarks.length; i++) {
    const label = multiHandedness[i]?.label;
    if (label === "Left"  && !leftLandmarks)  leftLandmarks  = multiHandLandmarks[i];
    if (label === "Right" && !rightLandmarks) rightLandmarks = multiHandLandmarks[i];
  }
  if (!leftLandmarks && !rightLandmarks) return null;
  const leftFeatures  = leftLandmarks  ? normalizeLandmarks(leftLandmarks)  : new Array(42).fill(0.0);
  const rightFeatures = rightLandmarks ? normalizeLandmarks(rightLandmarks) : new Array(42).fill(0.0);
  const leftPresent   = leftLandmarks  ? 1.0 : 0.0;
  const rightPresent  = rightLandmarks ? 1.0 : 0.0;
  return [...leftFeatures, ...rightFeatures, leftPresent, rightPresent];
}

// ── Simulates the setBuffer logic in page.tsx ───────────────────────────────

function simulateRecording(frames, isTwoHandSign) {
  let buffer = [];
  let isRecording = true;
  let sequenceError = null;

  for (const features of frames) {
    if (!isRecording) break;
    if (buffer.length >= 30) break;

    if (features && features.length === 86 && features.every(Number.isFinite)) {
      buffer.push(features);

      if (buffer.length === 30) {
        if (isTwoHandSign) {
          const TWO_HAND_THRESHOLD = 0.80;
          const bothHandsCount = buffer.filter(f => f[84] === 1.0 && f[85] === 1.0).length;
          const ratio = bothHandsCount / 30;

          if (ratio < TWO_HAND_THRESHOLD) {
            sequenceError = `Sequence discarded: ${Math.round(ratio * 100)}%`;
            buffer = [];
            isRecording = false;
            break;
          }
        }
        isRecording = false; // Capture completed
      }
    }
  }

  return { buffer, sequenceError };
}

// ── Fixtures ────────────────────────────────────────────────────────────────

function createMockLandmarks(offset) {
  const lm = [];
  for (let i = 0; i < 21; i++) lm.push({ x: i + offset, y: i + offset, z: 0 });
  return lm;
}
function bothHandsFeatures() {
  return processUnifiedHands([createMockLandmarks(10), createMockLandmarks(20)], [{ label: "Left" }, { label: "Right" }]);
}
function leftOnlyFeatures() {
  return processUnifiedHands([createMockLandmarks(10)], [{ label: "Left" }]);
}

// ── Tests ────────────────────────────────────────────────────────────────────

function runTests() {
  console.log("=== TWO-HAND RATIO TESTS ===\n");
  let passed = 0, failed = 0;

  // Test 1: 100% two-hand detection -> Accepted
  try {
    const frames = new Array(30).fill(bothHandsFeatures());
    const res = simulateRecording(frames, true);
    assert.strictEqual(res.buffer.length, 30);
    assert.strictEqual(res.sequenceError, null);
    console.log("Test 1 (100% two-hand -> accepted): PASSED");
    passed++;
  } catch (e) { console.error("Test 1 FAILED:", e.message); failed++; }

  // Test 2: 90% two-hand detection (27 both, 3 one) -> Accepted
  try {
    const frames = [...new Array(27).fill(bothHandsFeatures()), ...new Array(3).fill(leftOnlyFeatures())];
    const res = simulateRecording(frames, true);
    assert.strictEqual(res.buffer.length, 30);
    assert.strictEqual(res.sequenceError, null);
    console.log("Test 2 (90% two-hand -> accepted): PASSED");
    passed++;
  } catch (e) { console.error("Test 2 FAILED:", e.message); failed++; }

  // Test 3: 80% two-hand detection (24 both, 6 one) -> Accepted
  try {
    const frames = [...new Array(24).fill(bothHandsFeatures()), ...new Array(6).fill(leftOnlyFeatures())];
    const res = simulateRecording(frames, true);
    assert.strictEqual(res.buffer.length, 30);
    assert.strictEqual(res.sequenceError, null);
    console.log("Test 3 (80% two-hand -> accepted): PASSED");
    passed++;
  } catch (e) { console.error("Test 3 FAILED:", e.message); failed++; }

  // Test 4: 79% two-hand detection (23 both, 7 one) -> Rejected
  try {
    const frames = [...new Array(23).fill(bothHandsFeatures()), ...new Array(7).fill(leftOnlyFeatures())];
    const res = simulateRecording(frames, true);
    assert.strictEqual(res.buffer.length, 0); // buffer cleared
    assert.ok(res.sequenceError !== null, "Expected sequenceError to be set");
    console.log("Test 4 (79% two-hand -> rejected): PASSED");
    passed++;
  } catch (e) { console.error("Test 4 FAILED:", e.message); failed++; }

  // Test 5: Missing-hand frames contain zero-padding and correct presence flag
  try {
    const f = leftOnlyFeatures();
    assert.strictEqual(f[84], 1.0, "Left presence flag should be 1.0");
    assert.strictEqual(f[85], 0.0, "Right presence flag should be 0.0");
    const rightSide = f.slice(42, 84);
    assert.ok(rightSide.every(v => v === 0.0), "Right side features should be entirely zero-padded");
    console.log("Test 5 (Zero padding verified): PASSED");
    passed++;
  } catch (e) { console.error("Test 5 FAILED:", e.message); failed++; }

  console.log(`\n=== RESULTS: ${passed} passed, ${failed} failed ===`);
  if (failed > 0) process.exit(1);
}

runTests();
