/**
 * SMOKE TEST: Schema, Normalization, and Export consistency.
 * Uses synthetic numerical fixtures as permitted by Phase 4A spec.
 */

const fs = require('fs');
const path = require('path');

// 1. Mock normalizeLandmarks (same logic as our frontend code)
function normalizeLandmarks(landmarks) {
  const wrist = landmarks[0];
  const relative = landmarks.map(lm => ({ x: lm.x - wrist.x, y: lm.y - wrist.y }));
  
  let maxAbs = 0;
  for (const lm of relative) {
    if (Math.abs(lm.x) > maxAbs) maxAbs = Math.abs(lm.x);
    if (Math.abs(lm.y) > maxAbs) maxAbs = Math.abs(lm.y);
  }
  
  const flattened = [];
  for (const lm of relative) {
    flattened.push(maxAbs > 0 ? lm.x / maxAbs : 0);
    flattened.push(maxAbs > 0 ? lm.y / maxAbs : 0);
  }
  return flattened;
}

// 2. Generate Synthetic MediaPipe Landmarks
function generateSyntheticLandmarks(frameIndex) {
  // 21 landmarks, simulating slight motion
  const landmarks = [];
  for (let i = 0; i < 21; i++) {
    landmarks.push({
      x: (i * 10) + frameIndex, // Fake X
      y: (i * 20) + (frameIndex * 2) // Fake Y
    });
  }
  return landmarks;
}

// 3. Smoke Test Pipeline
function runSmokeTest() {
  console.log("=== STARTING SMOKE TEST ===");
  const targetSign = { id: 8, label: "Hello" };
  const signerId = "smoke_tester";
  
  const dataset = [];

  for (let seq = 1; seq <= 3; seq++) {
    console.log(`\nCapturing Sequence ${seq}...`);
    const buffer = [];
    
    // Simulate 30 frames from camera
    for (let f = 0; f < 30; f++) {
      const rawLandmarks = generateSyntheticLandmarks(f);
      const normalized = normalizeLandmarks(rawLandmarks);
      
      // Quality Check
      if (normalized.length !== 42) throw new Error("Feature dimension failed.");
      if (normalized.some(val => !Number.isFinite(val))) throw new Error("NaN/Infinity detected.");
      
      buffer.push(normalized);
    }
    
    // Simulate Saving
    if (buffer.length === 30) {
      const sample = {
        dataset_version: "1.0",
        sample_id: `synthetic_${targetSign.label}_${signerId}_${Date.now()}_seq${seq}`,
        signer_id: signerId,
        sign_class: targetSign.id,
        sign_label: targetSign.label,
        capture_timestamp: new Date().toISOString(),
        frame_count: buffer.length,
        feature_dimension: 42,
        frames: buffer
      };
      dataset.push(sample);
      console.log(`✓ Valid. Sample saved: ${sample.sample_id}`);
    }
  }
  
  // 4. Export JSON
  const exportPath = path.join(process.cwd(), 'datasets/pilot/exports/smoke_test_export.json');
  fs.writeFileSync(exportPath, JSON.stringify(dataset, null, 2));
  console.log(`\n=== SMOKE TEST SUCCESS ===`);
  console.log(`Exported 3 sequences to ${exportPath}`);
}

try {
  runSmokeTest();
} catch(e) {
  console.error("SMOKE TEST FAILED:", e);
  process.exit(1);
}
