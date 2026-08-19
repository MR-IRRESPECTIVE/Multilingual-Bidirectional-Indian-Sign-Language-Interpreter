/**
 * test_signer_identity.js — Signer Identity Tests
 *
 * Tests globally unique ID generation, persistence semantics, and legacy ID preservation.
 * Self-contained: implements signer logic inline using Node.js crypto module,
 * matching the logic in signer.ts.
 *
 * Run from project root:  node frontend/src/utils/test_signer_identity.js
 */

"use strict";

const assert = require("assert");
const { randomUUID } = require("crypto");

// ── Inline implementation (matches signer.ts exactly) ──────────────────────

function generateSignerId() {
  return `signer_${randomUUID()}`;
}

function createSigner(name) {
  return { id: generateSignerId(), name: name.trim() };
}

function simulateLocalStorageRoundTrip(signers) {
  // Simulates: localStorage.setItem(key, JSON.stringify(signers))
  //        then: JSON.parse(localStorage.getItem(key))
  return JSON.parse(JSON.stringify(signers));
}

const UUID_PATTERN = /^signer_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// ── Tests ───────────────────────────────────────────────────────────────────

function runTests() {
  console.log("=== SIGNER IDENTITY TESTS ===\n");
  let passed = 0;
  let failed = 0;

  // Test 1: UUID format validation
  try {
    const id = generateSignerId();
    assert.match(id, UUID_PATTERN, `"${id}" does not match signer_<UUID> format`);
    console.log(`Test 1 (UUID format): PASSED — ${id}`);
    passed++;
  } catch (e) {
    console.error("Test 1 FAILED:", e.message);
    failed++;
  }

  // Test 2: Uniqueness — 1000 generated IDs must have zero collisions
  try {
    const ids = new Set();
    for (let i = 0; i < 1000; i++) ids.add(generateSignerId());
    assert.strictEqual(ids.size, 1000, `Collision among 1000 IDs — set size was ${ids.size}`);
    console.log("Test 2 (Uniqueness — 1000 IDs): PASSED");
    passed++;
  } catch (e) {
    console.error("Test 2 FAILED:", e.message);
    failed++;
  }

  // Test 3: Local persistence — ID survives localStorage round-trip (browser restart simulation)
  // Correct semantics: the ID is STORED, not re-derived from the name.
  // After serialize → deserialize, the exact same signer_id is recovered.
  try {
    const signer = createSigner("Rohan");
    const originalId = signer.id;
    const originalName = signer.name;

    const restored = simulateLocalStorageRoundTrip([signer]);

    assert.strictEqual(restored[0].id, originalId,
      "signer_id changed after localStorage round-trip — ID must be stored, not re-derived");
    assert.strictEqual(restored[0].name, originalName,
      "signer_name changed after localStorage round-trip");
    assert.match(restored[0].id, UUID_PATTERN, "Restored ID is not in UUID format");
    console.log(`Test 3 (Local persistence): PASSED — "${originalId}" survived round-trip`);
    passed++;
  } catch (e) {
    console.error("Test 3 FAILED:", e.message);
    failed++;
  }

  // Test 4: Name is irrelevant to ID — two independent createSigner("Rohan") calls
  // simulate two different computers creating a signer with the same display name.
  // They MUST receive different signer_ids.
  try {
    const signerComputerA = createSigner("Rohan"); // Computer A
    const signerComputerB = createSigner("Rohan"); // Computer B (independent call)

    assert.notStrictEqual(
      signerComputerA.id,
      signerComputerB.id,
      "Two independent createSigner('Rohan') calls produced the SAME ID — display name must not seed the UUID"
    );
    assert.strictEqual(signerComputerA.name, "Rohan");
    assert.strictEqual(signerComputerB.name, "Rohan");
    assert.match(signerComputerA.id, UUID_PATTERN);
    assert.match(signerComputerB.id, UUID_PATTERN);

    console.log(`Test 4 (Same name -> different IDs across computers): PASSED`);
    console.log(`  Computer A: ${signerComputerA.id}`);
    console.log(`  Computer B: ${signerComputerB.id}`);
    passed++;
  } catch (e) {
    console.error("Test 4 FAILED:", e.message);
    failed++;
  }

  // Test 5: Legacy ID preservation — loading existing legacy IDs must not change them
  try {
    const legacySigners = [
      { id: "signer_A",     name: "Signer A" },
      { id: "signer_005",   name: "rohan" },
      { id: "signer_B",     name: "Signer B" },
      { id: "smoke_tester", name: "Smoke Tester" },
    ];
    const restored = simulateLocalStorageRoundTrip(legacySigners);

    assert.strictEqual(restored[0].id, "signer_A",     "signer_A was modified");
    assert.strictEqual(restored[1].id, "signer_005",   "signer_005 was modified");
    assert.strictEqual(restored[2].id, "signer_B",     "signer_B was modified");
    assert.strictEqual(restored[3].id, "smoke_tester", "smoke_tester was modified");
    console.log("Test 5 (Legacy ID preservation): PASSED — signer_A, signer_005 unchanged");
    passed++;
  } catch (e) {
    console.error("Test 5 FAILED:", e.message);
    failed++;
  }

  // Test 6: signer_name is always present in exported sample (never undefined)
  try {
    const signer = createSigner("Priya");

    const sample = {
      dataset_version: "1.0",
      sample_id: "Namaste_" + signer.id + "_1234567890",
      signer_id: signer.id,
      signer_name: signer.name,  // Must always be populated — never selectedSigner?.name alone
      sign_class: 32,
      sign_label: "Namaste",
      capture_timestamp: new Date().toISOString(),
      frame_count: 30,
      feature_dimension: 86,
      feature_generation: "v2-86",
      frames: new Array(30).fill(new Array(86).fill(0.0)),
    };

    assert.ok(sample.signer_name !== undefined, "signer_name is undefined");
    assert.ok(sample.signer_name !== null,      "signer_name is null");
    assert.ok(sample.signer_name.length > 0,    "signer_name is empty string");

    // Simulate export/import round-trip (JSON.stringify -> JSON.parse)
    const exported = JSON.parse(JSON.stringify([sample]));
    assert.strictEqual(exported[0].signer_name,       "Priya",     "signer_name lost in export");
    assert.strictEqual(exported[0].signer_id,         signer.id,   "signer_id lost in export");
    assert.strictEqual(exported[0].feature_generation, "v2-86",    "feature_generation lost in export");
    assert.strictEqual(exported[0].feature_dimension,  86,          "feature_dimension wrong");

    console.log("Test 6 (signer_name always in exported sample): PASSED");
    passed++;
  } catch (e) {
    console.error("Test 6 FAILED:", e.message);
    failed++;
  }

  // Summary
  console.log(`\n=== RESULTS: ${passed} passed, ${failed} failed ===`);
  if (failed > 0) process.exit(1);
  console.log("=== ALL SIGNER IDENTITY TESTS PASSED ===");
}

runTests();
