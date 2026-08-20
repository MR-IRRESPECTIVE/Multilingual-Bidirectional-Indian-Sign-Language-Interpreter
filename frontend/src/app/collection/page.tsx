"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { processUnifiedHands } from "@/utils/landmark_processing";
import { saveSample, getAllSamples, clearSamples, SampleMetadata } from "@/utils/storage";
import { Signer, createSigner, loadSigners, saveSigners } from "@/utils/signer";

// ══════════════════════════════════════════════════════════════════════
// SIGN CONFIGURATION
// ══════════════════════════════════════════════════════════════════════
// "hands: two" = sequence validation mode. 30 frames are collected,
//                then checked to ensure at least 80% have both hands.
// "hands: one" = normal mode: any frame with at least one hand is accepted.
// ══════════════════════════════════════════════════════════════════════

interface Sign {
  id: number;
  label: string;
  type: string;
  hands: "one" | "two";
}

const MVP_SIGNS: Sign[] = [
  { id: 8,  label: "Hello",      type: "Dynamic", hands: "one" },
  { id: 9,  label: "Sorry",      type: "Dynamic", hands: "one" },
  { id: 29, label: "Eat / Food", type: "Dynamic", hands: "one" },
  { id: 30, label: "Indian",     type: "Dynamic", hands: "one" },
  { id: 32, label: "Namaste",    type: "Static",  hands: "two" },  // Ratio-based two-hand enforcement
  { id: 33, label: "Thank You",  type: "Dynamic", hands: "one" },
  { id: 34, label: "Love",       type: "Dynamic", hands: "two" },
  { id: 37, label: "Good",       type: "Dynamic", hands: "one" },
  { id: 39, label: "Yes",        type: "Dynamic", hands: "one" },
  { id: 38, label: "No",         type: "Dynamic", hands: "one" },
];

export default function CollectionPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isReady, setIsReady] = useState(false);

  // ── Signer management ──────────────────────────────────────────────
  const [signers, setSigners] = useState<Signer[]>([]);
  const [selectedSignerId, setSelectedSignerId] = useState("signer_A");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const loaded = loadSigners();
      setSigners(loaded);
      if (loaded.length > 0 && !loaded.some(s => s.id === selectedSignerId)) {
        setSelectedSignerId(loaded[0].id);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddSigner = () => {
    const name = prompt("Enter the new signer'\''s name:");
    if (!name || name.trim() === "") return;
    const trimmed = name.trim();
    if (signers.some(s => s.name.toLowerCase() === trimmed.toLowerCase())) {
      alert("A signer with this name already exists on this computer.");
      return;
    }
    const newSigner = createSigner(trimmed);
    const updated = [...signers, newSigner];
    setSigners(updated);
    saveSigners(updated);
    setSelectedSignerId(newSigner.id);
  };

  // ── Recording state ────────────────────────────────────────────────
  const [targetSign, setTargetSign] = useState<Sign>(MVP_SIGNS[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [leftDetected, setLeftDetected] = useState(false);
  const [rightDetected, setRightDetected] = useState(false);
  const [buffer, setBuffer] = useState<number[][]>([]);
  const [lastSample, setLastSample] = useState<SampleMetadata | null>(null);
  const [savedCount, setSavedCount] = useState(0);
  const [isSavingUI, setIsSavingUI] = useState(false);
  const [sequenceError, setSequenceError] = useState<string | null>(null);

  // ── Synchronous locks and references ──────────────────────────────
  const isSavingRef = useRef(false);
  const captureIdRef = useRef<number | null>(null);
  const isRecordingRef = useRef(false);
  const isMountedRef = useRef(true);

  const targetSignRef = useRef<Sign>(MVP_SIGNS[0]);

  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  useEffect(() => {
    targetSignRef.current = targetSign;
  }, [targetSign]);

  // ── MediaPipe lifecycle ────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    isMountedRef.current = true;

    let camera: any;
    let hands: any;

    const initMediaPipe = async () => {
      // @ts-ignore
      if (!window.Hands || !window.Camera) {
        if (isMountedRef.current) setTimeout(initMediaPipe, 500);
        return;
      }

      console.log("[MediaPipe] instance created");

      // @ts-ignore
      hands = new window.Hands({
        locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
      });

      hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.7
      });

      hands.onResults((results: any) => {
        if (!isMountedRef.current) return;

        // ── Draw frame ─────────────────────────────────────────────
        const canvasCtx = canvasRef.current?.getContext("2d");
        if (canvasCtx && canvasRef.current && videoRef.current) {
          canvasCtx.save();
          canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          canvasCtx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);

          let leftDet = false;
          let rightDet = false;

          if (results.multiHandLandmarks && results.multiHandedness) {
            for (let i = 0; i < results.multiHandedness.length; i++) {
              if (results.multiHandedness[i].label === "Left")  leftDet = true;
              if (results.multiHandedness[i].label === "Right") rightDet = true;
            }
            for (const landmarks of results.multiHandLandmarks) {
              // @ts-ignore
              window.drawConnectors(canvasCtx, landmarks, window.HAND_CONNECTIONS, { color: "#00FF00", lineWidth: 2 });
              // @ts-ignore
              window.drawLandmarks(canvasCtx, landmarks, { color: "#FF0000", lineWidth: 1 });
            }
          }

          setLeftDetected(leftDet);
          setRightDetected(rightDet);
          canvasCtx.restore();

          // ── Frame collection ───────────────────────────────────
          setBuffer((prevBuffer) => {
            if (!isRecordingRef.current) return prevBuffer;
            if (prevBuffer.length >= 30) return prevBuffer; // Safety bound

            try {
              const unifiedFeatures = processUnifiedHands(results.multiHandLandmarks, results.multiHandedness);

              if (unifiedFeatures && unifiedFeatures.length === 86 && unifiedFeatures.every(Number.isFinite)) {
                
                // NO STRICT FRAME DROP. We accept all frames (up to 30) as long as at least 
                // one hand is detected. Missing hand is zero-padded with 0.0 presence flag.
                
                const newBuffer = [...prevBuffer, unifiedFeatures];
                console.log(`[Collection] Frame accepted: ${newBuffer.length}/30`);

                if (newBuffer.length === 30) {
                  // SEQUENCE VALIDATION
                  const isTwoHandSign = targetSignRef.current.hands === "two";
                  if (isTwoHandSign) {
                    const TWO_HAND_THRESHOLD = 0.80;
                    const bothHandsCount = newBuffer.filter(f => f[84] === 1.0 && f[85] === 1.0).length;
                    const ratio = bothHandsCount / 30;

                    if (ratio < TWO_HAND_THRESHOLD) {
                      const pct = Math.round(ratio * 100);
                      console.log(`[Collection] Sequence rejected: ${pct}% two-hand detection`);
                      
                      setSequenceError(`Sequence discarded: Both hands were detected in only ${pct}% of frames (minimum 80% required). Please try to keep both hands visible.`);
                      setIsRecording(false);
                      isRecordingRef.current = false;
                      return []; // Discard buffer
                    }
                  }

                  // Passed validation or is one-handed
                  captureIdRef.current = Date.now();
                  console.log("[Collection] Capture completion triggered at 30/30");
                  isRecordingRef.current = false;
                  setIsRecording(false);
                  setSequenceError(null);
                  console.log("[Collection] Recording stopped automatically");
                }
                return newBuffer;
              }
            } catch (e) {
              console.error("Normalization error:", e);
            }
            return prevBuffer;
          });
        }
      });

      if (videoRef.current) {
        // @ts-ignore
        camera = new window.Camera(videoRef.current, {
          onFrame: async () => {
            if (videoRef.current && isMountedRef.current && hands) {
              try {
                await hands.send({ image: videoRef.current });
              } catch (e) {
                if (isMountedRef.current) console.error("[MediaPipe] send error:", e);
              }
            }
          },
          width: 640,
          height: 480
        });
        camera.start();
        setIsReady(true);
      }
    };

    initMediaPipe();
    updateSavedCount();

    return () => {
      isMountedRef.current = false;
      if (camera) camera.stop();
      if (hands)  hands.close();
    };
  }, []); // Run ONCE on mount

  // ── Helpers ────────────────────────────────────────────────────────

  const updateSavedCount = async () => {
    const samples = await getAllSamples();
    setSavedCount(samples.length);
  };

  const handleStart = () => {
    setBuffer([]);
    captureIdRef.current = null;
    setLastSample(null);
    setSequenceError(null);
    setIsRecording(true);
  };

  const handleStop = () => {
    setIsRecording(false);
  };

  const handleSave = async () => {
    const isTwoHandedSign = targetSign.hands === "two";
    const canSave = isTwoHandedSign ? (buffer.length === 30) : (buffer.length >= 15);
    
    if (!canSave || isSavingRef.current) return;
    isSavingRef.current = true;
    setIsSavingUI(true);

    const uniqueCaptureId = captureIdRef.current || Date.now();
    const sampleId = `${targetSign.label.replace(/\s+/g, "")}_${selectedSignerId}_${uniqueCaptureId}`;
    const selectedSigner = signers.find(s => s.id === selectedSignerId);

    const sample: SampleMetadata = {
      dataset_version: "1.0",
      sample_id: sampleId,
      signer_id: selectedSignerId,
      signer_name: selectedSigner?.name ?? selectedSignerId,
      sign_class: targetSign.id,
      sign_label: targetSign.label,
      capture_timestamp: new Date().toISOString(),
      frame_count: buffer.length,
      feature_dimension: buffer[0]?.length || 86,
      feature_generation: "v2-86",
      frames: [...buffer]
    };

    try {
      await saveSample(sample);
      setLastSample(sample);
      setBuffer([]);
      captureIdRef.current = null;
      updateSavedCount();
    } catch (e: any) {
      console.error("[Diagnostic] Persistence boundary error: " + e.name);
      alert("Failed to save sample: " + e);
    } finally {
      isSavingRef.current = false;
      setIsSavingUI(false);
    }
  };

  const handleExport = async () => {
    const samples = await getAllSamples();
    const blob = new Blob([JSON.stringify(samples, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `isl_pilot_dataset_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClear = async () => {
    if (confirm("Are you sure you want to delete all locally stored samples?")) {
      await clearSamples();
      updateSavedCount();
    }
  };

  // ── Derived UI state ───────────────────────────────────────────────
  const isTwoHandedSign = targetSign.hands === "two";
  const showHandWarning = isRecording && isTwoHandedSign && (!leftDetected || !rightDetected);

  const formatSignerId = (id: string) => {
    if (/^signer_[0-9a-f]{8}-/i.test(id)) return `…${id.slice(-8)}`;
    return id;
  };

  // ── Render ─────────────────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Script src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js" strategy="beforeInteractive" />
      <Script src="https://cdn.jsdelivr.net/npm/@mediapipe/control_utils/control_utils.js" strategy="beforeInteractive" />
      <Script src="https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js" strategy="beforeInteractive" />
      <Script src="https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js" strategy="beforeInteractive" />

      <h1 className="text-3xl font-bold border-b pb-2">ISL Data Collection Pilot</h1>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded shadow-sm">
        <p className="text-sm text-yellow-800 font-semibold">Privacy &amp; Consent Notice</p>
        <p className="text-sm text-yellow-700">
          By using this tool, you consent to the capture of your hand landmarks. No raw video or
          facial data is permanently saved or transmitted to any server. All data is saved locally
          on your device.
        </p>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded shadow-sm">
        <p className="text-sm font-semibold text-blue-800 mb-1">Multi-Computer Collection Guide</p>
        <ul className="text-xs text-blue-700 space-y-0.5 list-disc list-inside">
          <li><strong>GitHub repository</strong> = shared application code (same for all computers)</li>
          <li><strong>Browser (IndexedDB)</strong> = your local collection database — private to your computer</li>
          <li><strong>Exported JSON</strong> = your portable dataset — send this file to the coordinator</li>
          <li><strong>Signer ID</strong> = globally unique UUID — guaranteed collision-free when merging</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4 bg-white p-4 rounded-lg shadow border">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-end">
              <label className="block text-sm font-medium mb-1">Signer Identity</label>
              <button onClick={handleAddSigner} className="text-xs text-blue-600 hover:underline" disabled={isRecording}>
                + Add New Signer
              </button>
            </div>
            <select
              value={selectedSignerId}
              onChange={e => setSelectedSignerId(e.target.value)}
              className="w-full border p-2 rounded"
              disabled={isRecording}
            >
              {signers.map(signer => (
                <option key={signer.id} value={signer.id}>
                  {signer.name} ({formatSignerId(signer.id)})
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-400 font-mono truncate" title={selectedSignerId}>
              ID: {selectedSignerId}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Target Sign</label>
            <select
              value={targetSign.id}
              onChange={e => setTargetSign(MVP_SIGNS.find(s => s.id === parseInt(e.target.value)) || MVP_SIGNS[0])}
              className="w-full border p-2 rounded"
              disabled={isRecording}
            >
              {MVP_SIGNS.map(sign => (
                <option key={sign.id} value={sign.id}>
                  {sign.label} ({sign.type})
                </option>
              ))}
            </select>
          </div>

          <div className="p-4 bg-gray-50 border rounded text-center">
            <p className="text-sm text-gray-500">Instruction</p>
            <p className="font-semibold text-lg text-blue-700">Perform: {targetSign.label}</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Status:</span>
              <span className={`font-bold ${isRecording ? "text-red-600" : "text-gray-600"}`}>
                {isRecording ? "RECORDING..." : "READY"}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Hand Mode:</span>
              <span className={`font-bold text-sm ${isTwoHandedSign ? "text-purple-700" : "text-blue-600"}`}>
                {isTwoHandedSign ? "✌️ Two-handed (Ratio)" : "☝️ One-handed"}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Left Hand:</span>
              <span className={`font-bold ${leftDetected ? "text-green-600" : "text-gray-400"}`}>
                {leftDetected ? "✅ Detected" : "❌ Missing"}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Right Hand:</span>
              <span className={`font-bold ${rightDetected ? "text-green-600" : "text-gray-400"}`}>
                {rightDetected ? "✅ Detected" : "❌ Missing"}
              </span>
            </div>

            {showHandWarning && (
              <div className="bg-yellow-100 border-l-4 border-yellow-500 p-3 rounded">
                <p className="text-sm font-semibold text-yellow-800">
                  ⚠️ Try to keep both hands visible
                </p>
                <p className="text-xs text-yellow-700 mt-0.5">
                  Sequence will be evaluated at the end (80% two-hand detection required).
                </p>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Feature Dimension:</span>
              <span className="font-mono text-sm">86 (Unified)</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Sequence Buffer:</span>
              <span className="font-mono text-sm">{buffer.length} / 30 frames</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all"
                style={{ width: `${(buffer.length / 30) * 100}%` }}
              />
            </div>
          </div>

          {/* Action buttons area */}
          <div className="flex flex-col gap-3 pt-4">
            {sequenceError && (
              <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
                <p className="text-sm font-semibold text-red-800">Recording Failed</p>
                <p className="text-sm text-red-700">{sequenceError}</p>
              </div>
            )}
            <div className="flex gap-2">
              {!isRecording && buffer.length === 0 && (
                <button onClick={handleStart} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" disabled={!isReady}>
                  ● Start Recording
                </button>
              )}
              {isRecording && (
                <button onClick={handleStop} className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                  ■ Stop Early
                </button>
              )}
              {!isRecording && buffer.length > 0 && (
                <>
                  <button onClick={() => setBuffer([])} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
                    Discard
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={
                      (targetSign.hands === "two" ? buffer.length < 30 : buffer.length < 15) || isSavingUI
                    }
                    className={`flex-1 font-bold py-2 px-4 rounded text-white ${
                      (targetSign.hands === "two" ? buffer.length === 30 : buffer.length >= 15) && !isSavingUI
                        ? "bg-green-600 hover:bg-green-700" 
                        : "bg-green-300 cursor-not-allowed"
                    }`}
                  >
                    {isSavingUI ? "Saving..." : `✓ Save (${buffer.length})`}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="bg-black rounded-lg overflow-hidden relative shadow min-h-[300px] flex items-center justify-center">
          {!isReady && <p className="text-white absolute z-10">Initializing Camera &amp; AI...</p>}
          <video ref={videoRef} className="hidden" playsInline />
          <canvas ref={canvasRef} width={640} height={480} className="w-full h-auto" />
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow border flex justify-between items-center">
        <div>
          <p className="font-semibold text-gray-700">Samples collected in IndexedDB: {savedCount}</p>
          {lastSample && <p className="text-sm text-gray-500">Last saved: {lastSample.sample_id}</p>}
        </div>
        <div className="flex gap-2">
          <button onClick={handleClear} className="text-sm text-red-600 hover:underline px-2">Clear DB</button>
          <button onClick={handleExport} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow">
            Export Dataset (JSON)
          </button>
        </div>
      </div>
    </div>
  );
}
