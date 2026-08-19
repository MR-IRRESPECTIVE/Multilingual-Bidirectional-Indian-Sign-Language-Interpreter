// Regression Test: Dual-Layer Idempotency (Sync UI Lock + DB Persistence Lock)

let mockIndexedDB = new Map();

// Mock the IndexedDB .add() function
async function mockStoreAdd(sample) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (mockIndexedDB.has(sample.sample_id)) {
        const err = new Error("ConstraintError: Key already exists in the object store.");
        err.name = "ConstraintError";
        reject(err);
      } else {
        mockIndexedDB.set(sample.sample_id, sample);
        resolve();
      }
    }, 50); // Simulate network/DB latency
  });
}

class CollectionComponentMock {
  constructor() {
    this.buffer = [];
    this.isSavingRef = { current: false };
    this.captureIdRef = { current: null };
    this.savedCount = 0;
  }

  // Simulate MediaPipe filling the buffer
  simulateCapture() {
    this.buffer = new Array(30).fill([0.0]);
    this.captureIdRef.current = Date.now();
  }

  // The patched handleSave logic
  async handleSave() {
    if (this.buffer.length === 0 || this.isSavingRef.current) {
      console.log("[Diagnostic] Save lock REJECTED (buffer empty or already saving).");
      return;
    }
    
    this.isSavingRef.current = true;
    console.log("[Diagnostic] Save lock ACQUIRED.");
    
    const uniqueCaptureId = this.captureIdRef.current || Date.now();
    const sampleId = `Hello_signer_A_${uniqueCaptureId}`;
    console.log(`[Diagnostic] Persisting sample ID: ${sampleId}`);

    const sample = {
      sample_id: sampleId,
      frames: [...this.buffer]
    };

    try {
      await mockStoreAdd(sample);
      this.lastSavedCaptureId = uniqueCaptureId;
      this.buffer = []; 
      this.captureIdRef.current = null;
      this.savedCount++;
      console.log("[Diagnostic] Save successful.");
    } catch (e) {
      console.log("[Diagnostic] Persistence boundary error: " + e.name);
    } finally {
      this.isSavingRef.current = false;
      console.log("[Diagnostic] Save lock RELEASED.");
    }
  }
}

async function runDualLayerTests() {
  console.log("=== RUNNING DUAL-LAYER IDEMPOTENCY TEST ===\\n");
  
  mockIndexedDB.clear();
  const component = new CollectionComponentMock();

  console.log("--- TEST 1: Rapid Duplicate Clicks (React Event Loop Simulation) ---");
  component.simulateCapture();
  
  // Fire 3 clicks concurrently (simulating browser firing events before React re-renders)
  const click1 = component.handleSave();
  const click2 = component.handleSave();
  const click3 = component.handleSave();
  
  await Promise.all([click1, click2, click3]);
  
  console.log(`\\nResult after rapid triple-click:`);
  console.log(`Expected DB Count: 1 | Actual DB Count: ${mockIndexedDB.size}`);
  if (mockIndexedDB.size !== 1) throw new Error("Test 1 Failed: Idempotency broken");

  console.log("\\n--- TEST 2: Second Legitimate Capture (Capture B) ---");
  // Wait a moment so Date.now() changes for the next capture
  await new Promise(resolve => setTimeout(resolve, 10));
  
  component.simulateCapture();
  await component.handleSave();
  
  console.log(`\\nResult after second legitimate capture:`);
  console.log(`Expected DB Count: 2 | Actual DB Count: ${mockIndexedDB.size}`);
  if (mockIndexedDB.size !== 2) throw new Error("Test 2 Failed: Second capture failed to save");

  console.log("\\n--- TEST 3: Persistence Boundary Check (Bypassing UI Lock) ---");
  // Imagine the UI lock somehow failed or was bypassed, and we try to save the exact same capture ID again
  component.buffer = new Array(30).fill([0.0]);
  
  // Force the capture ID to be the same one we just successfully saved in Test 2
  // (In the real app, this happens if two events fire simultaneously with the exact same captureId)
  component.captureIdRef.current = component.lastSavedCaptureId; 
  component.isSavingRef.current = false; // Bypass UI lock
  
  await component.handleSave();
  
  console.log(`\\nResult after attempting to bypass UI lock and save the exact same capture ID:`);
  console.log(`Expected DB Count: 2 | Actual DB Count: ${mockIndexedDB.size}`);
  if (mockIndexedDB.size !== 2) throw new Error("Test 3 Failed: Persistence boundary allowed duplicate");

  console.log("\\n=== ALL TESTS PASSED SUCCESSFULLY ===");
}

runDualLayerTests().catch(e => {
  console.error("TEST FAILED:", e);
  process.exit(1);
});
