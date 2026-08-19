// Automated test for the Collection Auto-Completion Logic

class MockCollectionState {
  constructor() {
    this.buffer = [];
    this.isRecordingRef = { current: false };
    this.isRecordingUI = false;
    this.captureIdRef = { current: null };
  }

  // Mimic the React setBuffer functional update
  setBuffer(updater) {
    this.buffer = updater(this.buffer);
  }

  // Mimic the setIsRecording React dispatcher
  setIsRecording(val) {
    this.isRecordingUI = val;
  }

  startRecording() {
    this.buffer = [];
    this.isRecordingRef.current = true;
    this.isRecordingUI = true;
    this.captureIdRef.current = null;
  }

  // Simulate a MediaPipe frame arriving
  simulateFrameArrival(isValid) {
    this.setBuffer((prevBuffer) => {
      if (!this.isRecordingRef.current) return prevBuffer;
      if (prevBuffer.length >= 30) return prevBuffer;

      if (isValid) {
        const newBuffer = [...prevBuffer, "mock_frame"]; // appending a dummy frame
        console.log(`[Collection] Frame accepted: ${newBuffer.length}/30`);

        if (newBuffer.length === 30) {
          this.captureIdRef.current = Date.now();
          console.log("[Collection] Capture completion triggered at 30/30");
          
          this.isRecordingRef.current = false; // Synchronous ref update
          this.setIsRecording(false); // Queued UI update
          
          console.log("[Collection] Recording stopped automatically");
          console.log("[Collection] Completed capture ready for save");
        }
        return newBuffer;
      }
      return prevBuffer;
    });
  }
}

function runAutoCompletionTest() {
  console.log("=== AUTO-COMPLETION REGRESSION TEST ===\\n");
  const component = new MockCollectionState();

  console.log("--- Starting Recording ---");
  component.startRecording();

  console.log("\\n--- Simulating 29 Frames ---");
  for (let i = 0; i < 29; i++) {
    component.simulateFrameArrival(true);
  }
  
  console.log(`\\nState after 29 frames:`);
  console.log(`Buffer length: ${component.buffer.length}`);
  console.log(`isRecordingRef: ${component.isRecordingRef.current}`);
  console.log(`isRecordingUI: ${component.isRecordingUI}`);
  
  if (component.buffer.length !== 29 || !component.isRecordingRef.current || !component.isRecordingUI) {
    throw new Error("Test failed: Should still be recording after 29 frames");
  }

  console.log("\\n--- Simulating 30th Frame ---");
  component.simulateFrameArrival(true);

  console.log(`\\nState after 30 frames:`);
  console.log(`Buffer length: ${component.buffer.length}`);
  console.log(`isRecordingRef: ${component.isRecordingRef.current}`);
  console.log(`isRecordingUI: ${component.isRecordingUI}`);
  console.log(`Capture ID generated: ${component.captureIdRef.current !== null}`);

  if (component.buffer.length !== 30) throw new Error("Test failed: Buffer should be 30");
  if (component.isRecordingRef.current) throw new Error("Test failed: Ref lock should be false");
  if (component.isRecordingUI) throw new Error("Test failed: UI state should be queued to false");
  if (!component.captureIdRef.current) throw new Error("Test failed: Capture ID not generated");

  console.log("\\n--- Simulating 31st and 32nd Frame (Rapid firing callback) ---");
  component.simulateFrameArrival(true);
  component.simulateFrameArrival(true);

  console.log(`\\nState after overshooting frames:`);
  console.log(`Buffer length: ${component.buffer.length} (Expected: 30)`);
  if (component.buffer.length !== 30) throw new Error("Test failed: Additional frames were appended!");

  console.log("\\n=== ALL TESTS PASSED SUCCESSFULLY ===");
}

runAutoCompletionTest();
