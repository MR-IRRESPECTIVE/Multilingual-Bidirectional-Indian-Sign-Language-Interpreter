"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { processStatic42Features, processStatic42FeaturesFlipped } from "@/utils/landmark_processing";

// ── Constants ────────────────────────────────────────────────────────────────
const STATIC_ENDPOINT = "http://localhost:8000/api/translate/sign/static";
const INFERENCE_COOLDOWN_MS = 400;
const STABILITY_WINDOW = 10; // frames for stability tracker

// ── Types ────────────────────────────────────────────────────────────────────
interface PredictionResult {
  label: string;
  confidence: number;
  probabilities?: Record<string, number>;
  sign_id?: string;
}

interface CapturedFrame {
  timestamp: string;
  handedness: string;
  expected: string;
  a_prediction: string;
  a_confidence: number;
  a_top5: { label: string; prob: number }[];
  b_prediction: string;
  b_confidence: number;
  b_top5: { label: string; prob: number }[];
  a_features: number[];
  b_features: number[];
}

// ── Component ────────────────────────────────────────────────────────────────
export default function TestStaticLivePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Predictions
  const [predA, setPredA] = useState<PredictionResult | null>(null);
  const [predB, setPredB] = useState<PredictionResult | null>(null);

  // Stability tracking
  const [stabilityA, setStabilityA] = useState({ label: "---", count: 0, window: STABILITY_WINDOW });
  const [stabilityB, setStabilityB] = useState({ label: "---", count: 0, window: STABILITY_WINDOW });
  const historyA = useRef<string[]>([]);
  const historyB = useRef<string[]>([]);

  // Diagnostics
  const [handedness, setHandedness] = useState("---");
  const [handDetected, setHandDetected] = useState(false);
  const [fps, setFps] = useState(0);
  const [latencyA, setLatencyA] = useState(0);
  const [latencyB, setLatencyB] = useState(0);
  const [requestCount, setRequestCount] = useState(0);

  // Capture
  const [expectedSign, setExpectedSign] = useState("");
  const [captures, setCaptures] = useState<CapturedFrame[]>([]);
  const lastFeaturesA = useRef<number[]>([]);
  const lastFeaturesB = useRef<number[]>([]);

  // Refs for non-reactive state
  const stateRef = useRef({
    isDetecting: false,
    lastRequestTime: 0,
    busy: false,
  });
  const handsRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const isMountedRef = useRef(true);
  const lastFrameTime = useRef(Date.now());

  useEffect(() => { stateRef.current.isDetecting = isDetecting; }, [isDetecting]);
  useEffect(() => { isMountedRef.current = true; return () => { isMountedRef.current = false; }; }, []);

  // ── Stability tracker ──────────────────────────────────────────────────────
  const updateStability = (history: React.MutableRefObject<string[]>, label: string, setter: React.Dispatch<React.SetStateAction<{ label: string; count: number; window: number }>>) => {
    history.current.push(label);
    if (history.current.length > STABILITY_WINDOW) history.current.shift();
    const counts: Record<string, number> = {};
    for (const l of history.current) counts[l] = (counts[l] || 0) + 1;
    let best = label, bestCount = 0;
    for (const [l, c] of Object.entries(counts)) {
      if (c > bestCount) { best = l; bestCount = c; }
    }
    setter({ label: best, count: bestCount, window: history.current.length });
  };

  // ── Top 5 from probabilities ───────────────────────────────────────────────
  const getTop5 = (probs?: Record<string, number>): { label: string; prob: number }[] => {
    if (!probs) return [];
    return Object.entries(probs)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([label, prob]) => ({ label, prob }));
  };

  // ── Inference ──────────────────────────────────────────────────────────────
  const performInference = useCallback(async (landmarks: any[], handednessLabel: string, w: number, h: number) => {
    const now = Date.now();
    if (now - stateRef.current.lastRequestTime < INFERENCE_COOLDOWN_MS) return;
    if (stateRef.current.busy) return;

    stateRef.current.busy = true;
    stateRef.current.lastRequestTime = now;

    // FPS
    const dt = now - lastFrameTime.current;
    lastFrameTime.current = now;
    if (dt > 0) setFps(Math.round(1000 / dt));

    try {
      // Generate BOTH feature vectors from the SAME landmarks
      const featuresA = processStatic42Features(landmarks, w, h);
      const featuresB = processStatic42FeaturesFlipped(landmarks, w, h);
      lastFeaturesA.current = featuresA;
      lastFeaturesB.current = featuresB;

      setHandedness(handednessLabel);
      setRequestCount(c => c + 1);

      // Panel A: UNFLIPPED → static_v1
      const startA = performance.now();
      const resA = await fetch(STATIC_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features: featuresA }),
      });
      const elapsedA = performance.now() - startA;
      setLatencyA(Math.round(elapsedA));

      if (resA.ok) {
        const dataA = await resA.json();
        if (dataA.success && dataA.prediction) {
          const p: PredictionResult = {
            label: dataA.prediction.label,
            confidence: dataA.prediction.confidence,
            probabilities: dataA.prediction.probabilities,
            sign_id: dataA.prediction.sign_id,
          };
          setPredA(p);
          updateStability(historyA, p.label, setStabilityA);
        }
      }

      // Panel B: MIRRORED → SAME static_v1
      const startB = performance.now();
      const resB = await fetch(STATIC_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features: featuresB }),
      });
      const elapsedB = performance.now() - startB;
      setLatencyB(Math.round(elapsedB));

      if (resB.ok) {
        const dataB = await resB.json();
        if (dataB.success && dataB.prediction) {
          const p: PredictionResult = {
            label: dataB.prediction.label,
            confidence: dataB.prediction.confidence,
            probabilities: dataB.prediction.probabilities,
            sign_id: dataB.prediction.sign_id,
          };
          setPredB(p);
          updateStability(historyB, p.label, setStabilityB);
        }
      }
    } catch (err) {
      console.error("[Inference error]", err);
    } finally {
      stateRef.current.busy = false;
    }
  }, []);

  // ── Capture frame ──────────────────────────────────────────────────────────
  const captureFrame = () => {
    if (!predA || !predB) return;
    const frame: CapturedFrame = {
      timestamp: new Date().toISOString(),
      handedness,
      expected: expectedSign || "(not set)",
      a_prediction: predA.label,
      a_confidence: predA.confidence,
      a_top5: getTop5(predA.probabilities),
      b_prediction: predB.label,
      b_confidence: predB.confidence,
      b_top5: getTop5(predB.probabilities),
      a_features: [...lastFeaturesA.current],
      b_features: [...lastFeaturesB.current],
    };
    setCaptures(prev => [...prev, frame]);
  };

  // ── Export captures ────────────────────────────────────────────────────────
  const exportCaptures = () => {
    const blob = new Blob([JSON.stringify(captures, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ab_test_captures_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── MediaPipe + Camera ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!cameraActive) { cleanupCamera(); return; }

    const initMediaPipe = () => {
      // @ts-ignore
      if (!window.Hands || !window.drawConnectors) {
        if (isMountedRef.current) setTimeout(initMediaPipe, 500);
        return;
      }
      try {
        // @ts-ignore
        const hands = new window.Hands({
          locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
        });
        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        hands.onResults((results: any) => {
          if (!isMountedRef.current || !cameraActive) return;
          const canvas = canvasRef.current;
          const ctx = canvas?.getContext("2d");
          if (!canvas || !ctx) return;

          ctx.clearRect(0, 0, canvas.width, canvas.height);

          if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            setHandDetected(true);
            const landmarks = results.multiHandLandmarks[0];
            const hLabel = results.multiHandedness?.[0]?.label || "Unknown";

            // @ts-ignore
            window.drawConnectors(ctx, landmarks, window.HAND_CONNECTIONS, { color: "#00FF00", lineWidth: 3 });
            // @ts-ignore
            window.drawLandmarks(ctx, landmarks, { color: "#FF0000", lineWidth: 1, radius: 3 });

            if (stateRef.current.isDetecting) {
              performInference(landmarks, hLabel, canvas.width, canvas.height);
            }
          } else {
            setHandDetected(false);
          }
        });

        handsRef.current = hands;
        startCamera();
      } catch (err) {
        setErrorMsg("Failed to initialize MediaPipe.");
      }
    };

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
        });
        if (!isMountedRef.current || !cameraActive) { stream.getTracks().forEach(t => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().then(() => startRenderLoop());
          };
        }
      } catch (err) {
        setErrorMsg("Camera access failed.");
      }
    };

    const startRenderLoop = async () => {
      if (!isMountedRef.current || !cameraActive) return;
      const video = videoRef.current;
      if (video && video.readyState >= 2 && video.videoWidth > 0) {
        if (canvasRef.current) {
          canvasRef.current.width = video.videoWidth;
          canvasRef.current.height = video.videoHeight;
        }
        if (handsRef.current) await handsRef.current.send({ image: video });
      }
      rafIdRef.current = requestAnimationFrame(startRenderLoop);
    };

    initMediaPipe();
    return () => cleanupCamera();
  }, [cameraActive, performInference]);

  const cleanupCamera = () => {
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    if (handsRef.current) { try { handsRef.current.close(); } catch (_) {} }
  };

  // ── Render helpers ─────────────────────────────────────────────────────────
  const ConfBar = ({ value }: { value: number }) => (
    <div className="w-full bg-gray-800 rounded-full h-2 mt-1">
      <div
        className={`h-2 rounded-full ${value > 0.8 ? "bg-green-500" : value > 0.5 ? "bg-yellow-500" : "bg-red-500"}`}
        style={{ width: `${Math.min(value * 100, 100)}%` }}
      />
    </div>
  );

  const PredPanel = ({
    title, subtitle, borderColor, bgColor, titleColor,
    pred, stability, latency
  }: {
    title: string; subtitle: string; borderColor: string; bgColor: string; titleColor: string;
    pred: PredictionResult | null; stability: { label: string; count: number; window: number }; latency: number;
  }) => {
    const top5 = getTop5(pred?.probabilities);
    return (
      <div className={`${bgColor} border ${borderColor} p-4 rounded-lg flex flex-col`}>
        <h2 className={`${titleColor} font-bold mb-1 uppercase tracking-wide text-sm border-b ${borderColor} pb-2`}>{title}</h2>
        <p className="text-xs text-gray-500 mb-3">{subtitle}</p>

        {/* Raw prediction */}
        <div className="text-center mb-2">
          <div className="text-xs text-gray-500 uppercase tracking-wider">Current Prediction</div>
          <div className="text-3xl font-black text-white py-1">{pred?.label || "---"}</div>
          <div className="text-sm">
            <span className="text-gray-500">Confidence: </span>
            <span className={`font-mono font-bold ${pred && pred.confidence > 0.6 ? "text-green-400" : "text-yellow-400"}`}>
              {pred ? (pred.confidence * 100).toFixed(1) + "%" : "0.0%"}
            </span>
          </div>
          <ConfBar value={pred?.confidence || 0} />
        </div>

        {/* Stability */}
        <div className="bg-gray-950/50 rounded p-2 mb-3">
          <div className="text-xs text-gray-500 uppercase tracking-wider">Stable Prediction</div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-blue-300">{stability.label}</span>
            <span className="text-xs font-mono text-gray-400">
              {stability.count}/{stability.window} frames
            </span>
          </div>
        </div>

        {/* Top 5 */}
        <div className="flex-1">
          <h4 className="text-xs font-semibold text-gray-400 mb-1">Top 5 Predictions:</h4>
          <div className="space-y-1">
            {top5.map((p, i) => (
              <div key={p.label} className="flex items-center gap-2 text-xs">
                <span className="w-4 text-gray-600">{i + 1}.</span>
                <span className="w-16 text-gray-300 truncate">{p.label}</span>
                <div className="flex-1 bg-gray-800 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${i === 0 ? "bg-blue-500" : "bg-gray-600"}`}
                    style={{ width: `${p.prob * 100}%` }}
                  />
                </div>
                <span className="w-12 text-right font-mono text-gray-400">{(p.prob * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Latency */}
        <div className="mt-2 text-xs text-gray-600 text-right">
          Latency: <span className="font-mono text-gray-400">{latency}ms</span>
        </div>
      </div>
    );
  };

  // ── Main render ────────────────────────────────────────────────────────────
  return (
    <>
      <div className="min-h-screen bg-gray-950 text-white p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-blue-400">A/B Preprocessing Experiment</h1>
            <p className="text-gray-400 text-sm">
              Both panels use the <span className="text-green-400 font-mono">SAME static_v1 model</span> via{" "}
              <span className="font-mono text-yellow-400">POST /api/translate/sign/static</span>.
              Only the preprocessing differs.
            </p>
            <div className="flex gap-4 mt-2 text-xs">
              <span className="bg-green-900/30 border border-green-800 px-2 py-1 rounded">✓ SAME MODEL</span>
              <span className="bg-yellow-900/30 border border-yellow-800 px-2 py-1 rounded">✓ DIFFERENT PREPROCESSING</span>
              <span className="bg-blue-900/30 border border-blue-800 px-2 py-1 rounded">Features: 42</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left: Camera + Diagnostics */}
            <div className="space-y-4">
              {/* Camera */}
              <div className="relative aspect-[4/3] bg-black border border-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
                {!cameraActive ? (
                  <button
                    onClick={() => setCameraActive(true)}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium"
                  >
                    Start Camera
                  </button>
                ) : errorMsg ? (
                  <div className="text-red-500">{errorMsg}</div>
                ) : (
                  <>
                    <video ref={videoRef} playsInline muted className="absolute inset-0 w-full h-full object-cover transform -scale-x-100" />
                    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover transform -scale-x-100 z-10 pointer-events-none" />
                  </>
                )}
              </div>

              {/* Controls */}
              <button
                onClick={() => setIsDetecting(!isDetecting)}
                disabled={!cameraActive}
                className={`w-full py-3 rounded-lg font-bold ${
                  isDetecting ? "bg-red-600 hover:bg-red-500" : "bg-green-600 hover:bg-green-500"
                } text-white disabled:opacity-50`}
              >
                {isDetecting ? "STOP DETECTION" : "START DETECTION"}
              </button>

              {/* Diagnostics */}
              <div className="bg-gray-900 border border-gray-800 p-3 rounded-lg">
                <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Diagnostics</h3>
                <div className="grid grid-cols-2 gap-1 text-xs font-mono">
                  <span className="text-gray-500">Hand:</span>
                  <span className={handDetected ? "text-green-400" : "text-red-400"}>{handDetected ? "YES" : "NO"}</span>
                  <span className="text-gray-500">Handedness:</span>
                  <span className="text-blue-400">{handedness}</span>
                  <span className="text-gray-500">FPS:</span>
                  <span className="text-yellow-400">{fps}</span>
                  <span className="text-gray-500">Requests:</span>
                  <span className="text-gray-400">{requestCount}</span>
                  <span className="text-gray-500">Features:</span>
                  <span className="text-gray-400">42</span>
                  <span className="text-gray-500">Endpoint:</span>
                  <span className="text-gray-400 truncate" title={STATIC_ENDPOINT}>/sign/static</span>
                  <span className="text-gray-500">Model:</span>
                  <span className="text-green-400">static_v1</span>
                </div>
              </div>

              {/* Capture */}
              <div className="bg-gray-900 border border-gray-800 p-3 rounded-lg">
                <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Capture Frame</h3>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Expected sign (A, B, C, 1, Hello...)"
                    value={expectedSign}
                    onChange={e => setExpectedSign(e.target.value)}
                    className="flex-1 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={captureFrame}
                    disabled={!predA || !predB}
                    className="flex-1 bg-purple-600 hover:bg-purple-500 text-white py-2 rounded text-sm font-bold disabled:opacity-50"
                  >
                    CAPTURE ({captures.length})
                  </button>
                  {captures.length > 0 && (
                    <button
                      onClick={exportCaptures}
                      className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm"
                    >
                      Export JSON
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right: A/B Panels */}
            <div className="lg:col-span-2 grid grid-cols-2 gap-4">
              <PredPanel
                title="Panel A — UNFLIPPED"
                subtitle="Raw MediaPipe landmarks → pixel → wrist-center → normalize. No X-inversion."
                borderColor="border-gray-700"
                bgColor="bg-gray-900"
                titleColor="text-gray-400"
                pred={predA}
                stability={stabilityA}
                latency={latencyA}
              />
              <PredPanel
                title="Panel B — MIRRORED"
                subtitle="x_sim = (1.0 − lm.x) → pixel → wrist-center → normalize. Simulates cv2.flip(image,1)."
                borderColor="border-blue-700"
                bgColor="bg-blue-950/30"
                titleColor="text-blue-400"
                pred={predB}
                stability={stabilityB}
                latency={latencyB}
              />
            </div>
          </div>

          {/* Preprocessing Documentation */}
          <div className="mt-6 bg-gray-900 border border-gray-800 p-4 rounded-lg">
            <h3 className="text-blue-400 font-bold mb-3">Preprocessing Documentation</h3>
            <div className="grid grid-cols-2 gap-6 text-xs">
              <div>
                <h4 className="text-gray-300 font-bold border-b border-gray-700 pb-1 mb-2">Panel A: UNFLIPPED</h4>
                <ol className="list-decimal pl-4 space-y-1 text-gray-400">
                  <li>MediaPipe returns landmarks (x, y) ∈ [0, 1] from <strong>un-flipped</strong> video</li>
                  <li>px = floor(lm.x × 640), py = floor(lm.y × 480)</li>
                  <li>Subtract wrist (landmark 0): rel = pt − wrist</li>
                  <li>Flatten: [x₀, y₀, x₁, y₁, ..., x₂₀, y₂₀] → 42 values</li>
                  <li>Max-absolute normalize: v / max(|v|) → [-1, 1]</li>
                </ol>
              </div>
              <div>
                <h4 className="text-blue-300 font-bold border-b border-blue-800 pb-1 mb-2">Panel B: MIRRORED (Training Domain)</h4>
                <ol className="list-decimal pl-4 space-y-1 text-gray-400">
                  <li>MediaPipe returns landmarks (x, y) ∈ [0, 1] from <strong>un-flipped</strong> video</li>
                  <li><strong className="text-yellow-400">x_sim = 1.0 − lm.x</strong> (simulates cv2.flip(image, 1))</li>
                  <li>px = floor(x_sim × 640), py = floor(lm.y × 480)</li>
                  <li>Subtract wrist (landmark 0): rel = pt − wrist</li>
                  <li>Flatten: [x₀, y₀, x₁, y₁, ..., x₂₀, y₂₀] → 42 values</li>
                  <li>Max-absolute normalize: v / max(|v|) → [-1, 1]</li>
                </ol>
                <p className="mt-2 text-yellow-400/80">
                  This matches the training domain: both Atharv and Maitree ran cv2.flip(image, 1) before MediaPipe.
                </p>
              </div>
            </div>
          </div>

          {/* Capture Log */}
          {captures.length > 0 && (
            <div className="mt-6 bg-gray-900 border border-gray-800 p-4 rounded-lg">
              <h3 className="text-purple-400 font-bold mb-3">Captured Frames ({captures.length})</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-mono">
                  <thead>
                    <tr className="text-gray-500 border-b border-gray-800">
                      <th className="py-1 px-2 text-left">#</th>
                      <th className="py-1 px-2 text-left">Expected</th>
                      <th className="py-1 px-2 text-left">A Pred</th>
                      <th className="py-1 px-2 text-right">A Conf</th>
                      <th className="py-1 px-2 text-center">A ✓</th>
                      <th className="py-1 px-2 text-left">B Pred</th>
                      <th className="py-1 px-2 text-right">B Conf</th>
                      <th className="py-1 px-2 text-center">B ✓</th>
                      <th className="py-1 px-2 text-left">Hand</th>
                    </tr>
                  </thead>
                  <tbody>
                    {captures.map((c, i) => {
                      const aMatch = c.a_prediction.toLowerCase() === c.expected.toLowerCase();
                      const bMatch = c.b_prediction.toLowerCase() === c.expected.toLowerCase();
                      return (
                        <tr key={i} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                          <td className="py-1 px-2 text-gray-600">{i + 1}</td>
                          <td className="py-1 px-2 text-white font-bold">{c.expected}</td>
                          <td className={`py-1 px-2 ${aMatch ? "text-green-400" : "text-red-400"}`}>{c.a_prediction}</td>
                          <td className="py-1 px-2 text-right text-gray-400">{(c.a_confidence * 100).toFixed(1)}%</td>
                          <td className="py-1 px-2 text-center">{aMatch ? "✅" : "❌"}</td>
                          <td className={`py-1 px-2 ${bMatch ? "text-green-400" : "text-red-400"}`}>{c.b_prediction}</td>
                          <td className="py-1 px-2 text-right text-gray-400">{(c.b_confidence * 100).toFixed(1)}%</td>
                          <td className="py-1 px-2 text-center">{bMatch ? "✅" : "❌"}</td>
                          <td className="py-1 px-2 text-gray-500">{c.handedness}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {/* Summary */}
              <div className="mt-3 flex gap-6 text-sm">
                <div className="text-gray-400">
                  Panel A Accuracy: <span className="font-bold text-white">
                    {captures.length > 0
                      ? ((captures.filter(c => c.a_prediction.toLowerCase() === c.expected.toLowerCase()).length / captures.length) * 100).toFixed(0) + "%"
                      : "N/A"}
                  </span>
                </div>
                <div className="text-blue-400">
                  Panel B Accuracy: <span className="font-bold text-white">
                    {captures.length > 0
                      ? ((captures.filter(c => c.b_prediction.toLowerCase() === c.expected.toLowerCase()).length / captures.length) * 100).toFixed(0) + "%"
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Test Protocol */}
          <div className="mt-6 bg-gray-900 border border-gray-800 p-4 rounded-lg">
            <h3 className="text-green-400 font-bold mb-3">Test Protocol</h3>
            <div className="text-sm text-gray-400 space-y-2">
              <p>1. Type the expected sign name in the input box (e.g., &quot;A&quot;)</p>
              <p>2. Hold the sign steady in front of the camera</p>
              <p>3. Wait for predictions to stabilize (watch stable prediction count)</p>
              <p>4. Click <strong className="text-purple-400">CAPTURE</strong> to record the comparison</p>
              <p>5. Repeat 10 times for each sign: <strong className="text-white">A, B, C, 1, Hello</strong></p>
              <p>6. Review the capture table and accuracy summary</p>
              <p>7. Click <strong>Export JSON</strong> to save the raw data</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
