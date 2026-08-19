/**
 * test_merge_validator.js — Dataset Merge Collision Detection Tests
 *
 * Tests the validateMerge() logic for signer_id conflicts, generation mix warnings,
 * and duplicate sample_ids.
 * Self-contained: implements validateMerge inline (matches mergeValidator.ts).
 *
 * Run from project root:  node frontend/src/utils/test_merge_validator.js
 */

"use strict";

const assert = require("assert");

// ── Inline implementation (matches mergeValidator.ts exactly) ──────────────

function validateMerge(datasets) {
  const allSamples = datasets.flat();
  const totalSamples = allSamples.length;

  // 1. Detect signer_id -> name conflicts
  const signerNames = new Map();
  for (const sample of allSamples) {
    const id = sample.signer_id;
    const name = sample.signer_name ?? "(unnamed)";
    if (!signerNames.has(id)) signerNames.set(id, new Set());
    signerNames.get(id).add(name);
  }
  const signerConflicts = [];
  for (const [id, names] of signerNames) {
    if (names.size > 1) signerConflicts.push({ signer_id: id, names: [...names] });
  }

  // 2. Detect feature generation mix (42 vs 86)
  const dims = new Set(allSamples.map(s => s.feature_dimension));
  const generationMixWarning = dims.has(42) && dims.has(86);

  // 3. Detect duplicate sample_ids
  const sampleIdCounts = new Map();
  for (const sample of allSamples) {
    sampleIdCounts.set(sample.sample_id, (sampleIdCounts.get(sample.sample_id) ?? 0) + 1);
  }
  const duplicateSampleIds = [];
  for (const [id, count] of sampleIdCounts) {
    if (count > 1) duplicateSampleIds.push(id);
  }

  const isClean = signerConflicts.length === 0 && !generationMixWarning && duplicateSampleIds.length === 0;
  return { totalSamples, signerConflicts, generationMixWarning, duplicateSampleIds, isClean };
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function makeSample(sampleId, signerId, signerName, dim) {
  return { sample_id: sampleId, signer_id: signerId, signer_name: signerName, feature_dimension: dim, frames: [] };
}

// ── Tests ────────────────────────────────────────────────────────────────────

function runTests() {
  console.log("=== MERGE VALIDATOR TESTS ===\n");
  let passed = 0;
  let failed = 0;

  // Test 1: Clean merge — two non-overlapping datasets with UUID-based IDs
  try {
    const datasetA = [
      makeSample("Hello_signer-uuid-1_001", "signer_550e8400-e29b-41d4-a716-000000000001", "Rohan", 86),
      makeSample("Hello_signer-uuid-1_002", "signer_550e8400-e29b-41d4-a716-000000000001", "Rohan", 86),
    ];
    const datasetB = [
      makeSample("Hello_signer-uuid-2_001", "signer_550e8400-e29b-41d4-a716-000000000002", "Amit",  86),
      makeSample("Hello_signer-uuid-2_002", "signer_550e8400-e29b-41d4-a716-000000000002", "Amit",  86),
    ];
    const report = validateMerge([datasetA, datasetB]);

    assert.strictEqual(report.totalSamples,              4);
    assert.strictEqual(report.signerConflicts.length,    0);
    assert.strictEqual(report.generationMixWarning,      false);
    assert.strictEqual(report.duplicateSampleIds.length, 0);
    assert.strictEqual(report.isClean,                   true);
    console.log("Test 1 (Clean merge of two UUID datasets): PASSED");
    passed++;
  } catch (e) {
    console.error("Test 1 FAILED:", e.message);
    failed++;
  }

  // Test 2: signer_id collision — same legacy ID, different display names
  // This is exactly the collision that UUID-based IDs prevent.
  try {
    const datasetA = [makeSample("s1", "signer_005", "Rohan", 86)]; // Computer A
    const datasetB = [makeSample("s2", "signer_005", "Amit",  86)]; // Computer B — collision!
    const report = validateMerge([datasetA, datasetB]);

    assert.strictEqual(report.signerConflicts.length, 1);
    assert.strictEqual(report.signerConflicts[0].signer_id, "signer_005");
    assert.ok(report.signerConflicts[0].names.includes("Rohan"), "Rohan missing from conflict names");
    assert.ok(report.signerConflicts[0].names.includes("Amit"),  "Amit missing from conflict names");
    assert.strictEqual(report.isClean, false);
    console.log("Test 2 (signer_id collision detection): PASSED");
    passed++;
  } catch (e) {
    console.error("Test 2 FAILED:", e.message);
    failed++;
  }

  // Test 3: Feature generation mix warning (42-feature legacy + 86-feature new)
  try {
    const legacyDataset = [
      makeSample("Hello_signer_A_001", "signer_A", "Signer A", 42), // legacy Hello/Yes
    ];
    const newDataset = [
      makeSample("Namaste_uuid-1_001", "signer_uuid-1", "Rohan", 86), // new two-hand
    ];
    const report = validateMerge([legacyDataset, newDataset]);

    assert.strictEqual(report.generationMixWarning, true);
    assert.strictEqual(report.isClean, false);
    console.log("Test 3 (Generation mix warning — 42-feature + 86-feature): PASSED");
    passed++;
  } catch (e) {
    console.error("Test 3 FAILED:", e.message);
    failed++;
  }

  // Test 4: Duplicate sample_ids — same recording exported twice
  try {
    const SAMPLE_ID = "Hello_signer_A_1787085041628";
    const datasetA = [makeSample(SAMPLE_ID, "signer_A", "Signer A", 86)];
    const datasetB = [makeSample(SAMPLE_ID, "signer_A", "Signer A", 86)]; // duplicate!
    const report = validateMerge([datasetA, datasetB]);

    assert.strictEqual(report.duplicateSampleIds.length, 1);
    assert.strictEqual(report.duplicateSampleIds[0], SAMPLE_ID);
    assert.strictEqual(report.isClean, false);
    console.log("Test 4 (Duplicate sample_id detection): PASSED");
    passed++;
  } catch (e) {
    console.error("Test 4 FAILED:", e.message);
    failed++;
  }

  // Test 5: Same signer_id + same name across two datasets is NOT a conflict
  // (e.g. Rohan collects in two sessions and exports twice — both files have same signer_A)
  try {
    const sessionA = [makeSample("Hello_signer_A_001", "signer_A", "Signer A", 86)];
    const sessionB = [makeSample("Hello_signer_A_002", "signer_A", "Signer A", 86)];
    const report = validateMerge([sessionA, sessionB]);

    assert.strictEqual(report.signerConflicts.length, 0, "Same ID + same name must NOT be flagged as conflict");
    assert.strictEqual(report.isClean, true);
    console.log("Test 5 (Same signer, same name across sessions — no conflict): PASSED");
    passed++;
  } catch (e) {
    console.error("Test 5 FAILED:", e.message);
    failed++;
  }

  // Test 6: Multiple issues in one merge
  try {
    const datasetA = [
      makeSample("s1", "signer_001", "Alice",   42), // legacy dim
      makeSample("s2", "signer_001", "Bob",     86), // collision with Alice
    ];
    const datasetB = [
      makeSample("s1", "signer_002", "Charlie", 86), // duplicate sample_id "s1"
    ];
    const report = validateMerge([datasetA, datasetB]);

    assert.ok(report.signerConflicts.length >= 1, "Expected signer conflict");
    assert.strictEqual(report.generationMixWarning, true);
    assert.ok(report.duplicateSampleIds.includes("s1"), "Expected duplicate s1");
    assert.strictEqual(report.isClean, false);
    console.log("Test 6 (Multiple issues detected together): PASSED");
    passed++;
  } catch (e) {
    console.error("Test 6 FAILED:", e.message);
    failed++;
  }

  // Test 7: Empty datasets — no crash
  try {
    const report = validateMerge([[], []]);
    assert.strictEqual(report.totalSamples, 0);
    assert.strictEqual(report.isClean, true);
    console.log("Test 7 (Empty datasets — no crash): PASSED");
    passed++;
  } catch (e) {
    console.error("Test 7 FAILED:", e.message);
    failed++;
  }

  console.log(`\n=== RESULTS: ${passed} passed, ${failed} failed ===`);
  if (failed > 0) process.exit(1);
  console.log("=== ALL MERGE VALIDATOR TESTS PASSED ===");
}

runTests();
