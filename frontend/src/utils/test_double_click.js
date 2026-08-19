// Automated regression test for Double-Click UI Bug

let savedSamples = [];

// Mock the React state machine for the Data Collection component
class MockCollectionComponent {
  constructor() {
    this.buffer = new Array(30).fill([0.0]); // Simulated 30-frame buffer
    this.isSaving = false;
    this.savedCount = 0;
  }

  // Mimic the async save operation
  async mockSaveSample(sample) {
    return new Promise(resolve => {
      setTimeout(() => {
        savedSamples.push(sample);
        resolve();
      }, 50); // 50ms latency
    });
  }

  // The actual patched handleSave logic
  async handleSave() {
    if (this.buffer.length === 0 || this.isSaving) return;
    this.isSaving = true;

    const sample = {
      sample_id: `synthetic_${Date.now()}_${Math.random()}`,
      frames: [...this.buffer]
    };

    try {
      await this.mockSaveSample(sample);
      this.buffer = []; // Synchronous React setBuffer([])
      this.savedCount++;
    } finally {
      this.isSaving = false;
    }
  }

  resetForNextCapture() {
    this.buffer = new Array(30).fill([0.0]);
  }
}

async function runRegressionTest() {
  console.log("=== DOUBLE-CLICK UI BUG REGRESSION TEST ===");
  const component = new MockCollectionComponent();
  
  // Test 1: Single Click
  console.log("\\n[Test 1] Single Click...");
  await component.handleSave();
  console.log(`Samples saved after single click: ${savedSamples.length} (Expected: 1)`);
  if (savedSamples.length !== 1) throw new Error("Single click test failed");

  // Reset environment
  savedSamples = [];
  component.resetForNextCapture();

  // Test 2: Double/Rapid Repeated Click
  console.log("\\n[Test 2] Rapid Double Click...");
  // Fire three handleSave clicks simultaneously without awaiting between them
  const p1 = component.handleSave();
  const p2 = component.handleSave();
  const p3 = component.handleSave();

  await Promise.all([p1, p2, p3]);

  console.log(`Samples saved after rapid triple-click: ${savedSamples.length} (Expected: 1)`);
  if (savedSamples.length !== 1) throw new Error("Double click test failed - idempotency broken");

  // Test 3: Second Legitimate Capture
  console.log("\\n[Test 3] Subsequent Legitimate Capture...");
  component.resetForNextCapture();
  
  await component.handleSave();
  console.log(`Total samples saved: ${savedSamples.length} (Expected: 2)`);
  if (savedSamples.length !== 2) throw new Error("Second capture test failed");

  console.log("\\n=== ALL TESTS PASSED ===");
}

runRegressionTest().catch(e => {
  console.error("TEST FAILED:", e);
  process.exit(1);
});
