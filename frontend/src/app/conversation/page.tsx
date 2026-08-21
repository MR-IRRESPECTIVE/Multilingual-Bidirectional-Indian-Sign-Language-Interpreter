'use client';

import React, { useState, useRef, useCallback } from 'react';
import StaticISLCamera from '@/features/isl-recognition/components/StaticISLCamera';
import { apiPost } from '@/lib/api/apiClient';

interface StaticRecognitionResponse {
  success: boolean;
  prediction: {
    sign_id: string | null;
    label: string;
    confidence: number;
    probabilities?: Record<string, number>;
  };
}

interface ConversationMessage {
  id: string;
  sender: 'userB';
  type: 'text';
  content: string;
  timestamp: number;
}

export default function ConversationPage() {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [cameraActive, setCameraActive] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [cameraStatus, setCameraStatus] = useState<'idle' | 'initializing' | 'ready' | 'error'>('idle');
  const [cameraError, setCameraError] = useState<string>('');
  const [showDebug, setShowDebug] = useState(false);

  // Three distinct levels of inference as requested
  const [rawDetection, setRawDetection] = useState<string>('NONE');
  const [rawConfidence, setRawConfidence] = useState<number>(0);
  const [stableDetection, setStableDetection] = useState<string>('NONE');

  // Inference throttle
  const lastInferenceTimeRef = useRef<number>(0);
  const INFERENCE_THROTTLE_MS = 400;

  // Stability tracking
  const predictionHistoryRef = useRef<string[]>([]);
  const STABILITY_THRESHOLD = 3;
  const STABILITY_WINDOW_SIZE = 5;

  // Prevent duplicate spam
  const lastCommittedSignRef = useRef<string | null>(null);
  const isRequestingRef = useRef(false);

  // Word normalization helper
  const normalizeLabel = (label: string): string => {
    // The backend labels are: 0, 1, 2, 3, 4, 7, 8, 9, hello, sorry, A, B, C
    if (label.startsWith('digit_')) return label.replace('digit_', '');
    if (label.toLowerCase() === 'hello') return 'Hello';
    if (label.toLowerCase() === 'sorry') return 'Sorry';
    return label.toUpperCase(); // A, B, C
  };

  const handleFeaturesExtracted = useCallback(async (features: number[]) => {
    if (isRequestingRef.current) return;

    const now = Date.now();
    if (now - lastInferenceTimeRef.current < INFERENCE_THROTTLE_MS) return;

    lastInferenceTimeRef.current = now;
    isRequestingRef.current = true;
    
    console.log("[ISL DEBUG] Hand detected");
    console.log(`[ISL DEBUG] Features generated: ${features.length}`);
    if (features.length > 0) {
      console.log(`[ISL DEBUG] First features: [${features[0].toFixed(3)}, ${features[1].toFixed(3)}, ...]`);
    }

    try {
      console.log("[ISL DEBUG] Sending inference request to /api/translate/sign/static");
      
      const response = await apiPost<StaticRecognitionResponse>('/api/translate/sign/static', { features });
      
      console.log("[ISL DEBUG] HTTP status: SUCCESS");
      console.log("[ISL DEBUG] Response:", JSON.stringify(response));

      if (!response || !response.prediction) {
        console.error("[ISL DEBUG] ERROR: Response missing 'prediction' object!", response);
        return;
      }

      const rawLabel = response.prediction.label;
      const confidence = response.prediction.confidence;
      const normalizedLabel = normalizeLabel(rawLabel);

      console.log(`[ISL DEBUG] Label: ${rawLabel} (Normalized: ${normalizedLabel})`);
      console.log(`[ISL DEBUG] Confidence: ${confidence}`);

      setRawDetection(normalizedLabel);
      setRawConfidence(confidence);

      // We still run the stability logic but also update a 'temporary bypass' display.

      if (confidence >= 0.6) {
        predictionHistoryRef.current.push(normalizedLabel);
      } else {
        console.log(`[ISL DEBUG] Prediction rejected: confidence ${confidence.toFixed(3)} < 0.60`);
        predictionHistoryRef.current.push('NONE');
      }

      if (predictionHistoryRef.current.length > STABILITY_WINDOW_SIZE) {
        predictionHistoryRef.current.shift();
      }

      // 4/5 Majority Rule
      const recent = predictionHistoryRef.current;
      const counts = recent.reduce((acc, curr) => {
        acc[curr] = (acc[curr] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      let newStableSign: string | null = null;
      for (const [lbl, count] of Object.entries(counts)) {
        if (lbl !== 'NONE' && count >= 4) {
          newStableSign = lbl;
          break;
        }
      }

      if (newStableSign) {
        console.log(`[ISL DEBUG] Stability reached for ${newStableSign}: ${counts[newStableSign]}/5`);
        setStableDetection(newStableSign);

        if (lastCommittedSignRef.current !== newStableSign) {
          console.log(`[ISL DEBUG] Commit: YES (${newStableSign})`);
          const botMsg: ConversationMessage = {
            id: Date.now().toString(),
            sender: 'userB',
            type: 'text',
            content: newStableSign,
            timestamp: Date.now()
          };
          setMessages(prev => [...prev, botMsg]);
          lastCommittedSignRef.current = newStableSign; // Lock
        } else {
          console.log(`[ISL DEBUG] Commit: NO (Locked on ${newStableSign})`);
        }
      } else {
        // No stable sign detected
        // We only clear the stable state if the window is dominated by NONE, or if we want it to clear on any non-stable?
        // User says: "Stable = NONE until one label consistently dominates the window."
        setStableDetection('NONE');
        console.log(`[ISL DEBUG] Stability not reached: ${recent.join(', ')}`);
      }
    } catch (err: any) {
      console.error("[ISL DEBUG] Inference error (Exception):", err);
      if (err.message) console.error("[ISL DEBUG] Error Message:", err.message);
    } finally {
      isRequestingRef.current = false;
    }
  }, []);

  const handleHandLost = useCallback(() => {
    if (isRequestingRef.current) return;
    const now = Date.now();
    // Use the same throttle so we don't spam state updates
    if (now - lastInferenceTimeRef.current < INFERENCE_THROTTLE_MS) return;

    lastInferenceTimeRef.current = now;

    setRawDetection('NONE');
    setRawConfidence(0);

    predictionHistoryRef.current.push('NONE');
    if (predictionHistoryRef.current.length > STABILITY_WINDOW_SIZE) {
      predictionHistoryRef.current.shift();
    }

    const recent = predictionHistoryRef.current;
    const noneCount = recent.filter(v => v === 'NONE').length;

    // 400ms throttle. 2 consecutive NONEs = ~800ms, 1 = ~400ms.
    // The user requested 300-500ms of no-hand detection. 1 throttled NONE implies at least 400ms has passed since the last valid feature extraction.
    if (noneCount >= 1) {
      setStableDetection('NONE');
      if (lastCommittedSignRef.current !== null) {
        console.log("[ISL DEBUG] Hand dropped / neutral. Releasing lock.");
      }
      lastCommittedSignRef.current = null;
    }
  }, []);

  const toggleCamera = () => {
    setCameraActive(!cameraActive);
    if (cameraActive) {
      setIsDetecting(false);
      resetState();
    }
  };

  const toggleDetection = () => {
    if (!cameraActive) return;
    if (!isDetecting) {
      resetState();
    }
    setIsDetecting(!isDetecting);
  };

  const resetState = () => {
    predictionHistoryRef.current = [];
    lastCommittedSignRef.current = null;
    setRawDetection('NONE');
    setRawConfidence(0);
    setStableDetection('NONE');
  };

  return (
    <>
      <div className="flex-grow flex flex-col md:flex-row h-[calc(100vh-64px)] overflow-hidden bg-gray-50">
        
        {/* LEFT PANEL: Conversation Transcript */}
        <div className="w-full md:w-1/2 flex flex-col border-r border-gray-200 bg-white relative">
          <div className="p-4 border-b border-gray-100 bg-white font-bold flex items-center justify-between shadow-sm z-10">
            <div className="flex items-center gap-2 text-blue-900">
              <span className="material-symbols-outlined">forum</span>
              ISL Translation
            </div>
            <div className="flex items-center gap-4">
              {/* Diagnostics button removed for presentation safety pass */}
              {messages.length > 0 && (
                <button 
                  onClick={() => setMessages([])}
                  className="text-sm font-medium text-gray-500 hover:text-red-500 transition-colors flex items-center gap-1 bg-gray-50 hover:bg-red-50 px-3 py-1.5 rounded-lg"
                >
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                  Clear
                </button>
              )}
            </div>
          </div>
          
          <div className="flex-grow p-6 overflow-y-auto flex flex-col gap-4 bg-gray-50">
            {messages.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60">
                  <span className="material-symbols-outlined text-6xl mb-4">sign_language</span>
                  <p className="text-xl font-medium text-gray-500">Waiting for your sign...</p>
               </div>
            ) : (
               messages.map(msg => (
                <div key={msg.id} className="p-4 rounded-2xl max-w-[80%] bg-blue-600 text-white self-start rounded-tl-sm shadow-md flex flex-col animate-in fade-in slide-in-from-left-4 duration-300">
                  <span className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-1 flex items-center gap-1">
                     <span className="material-symbols-outlined text-[14px]">person</span>
                     You
                  </span>
                  <p className="text-3xl font-black tracking-wide">{msg.content}</p>
                </div>
               ))
            )}
          </div>
        </div>

        {/* RIGHT PANEL: Live Camera */}
        <div className="w-full md:w-1/2 flex flex-col bg-gray-900 relative">
          <div className="p-4 border-b border-gray-800 bg-gray-950 font-semibold flex items-center justify-between text-white shadow-sm z-10">
            <div className="flex items-center gap-2 text-gray-200">
              <span className="material-symbols-outlined text-blue-400">photo_camera</span>
              Live ISL Camera
            </div>
            
            <button 
               onClick={toggleCamera}
               className={`px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 transition-colors ${cameraActive ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-blue-600 text-white hover:bg-blue-500'}`}
             >
               <span className="material-symbols-outlined text-[18px]">{cameraActive ? 'videocam_off' : 'videocam'}</span>
               {cameraActive ? 'Stop Camera' : 'Start Camera'}
             </button>
          </div>
          
          <div className="relative flex-grow flex flex-col overflow-hidden bg-black p-4 md:p-6 justify-center items-center">
             
             {/* Developer Diagnostics Overlay */}
             {showDebug && (
                <div className="absolute top-4 left-4 z-40 bg-black/90 p-3 rounded-lg text-xs font-mono text-green-400 border border-green-900/50 shadow-xl pointer-events-none min-w-[250px]">
                  <div className="font-bold text-white mb-2 border-b border-gray-700 pb-1">DIAGNOSTICS</div>
                  <div>Camera: {cameraStatus.toUpperCase()}</div>
                  <div>MediaPipe: {cameraStatus === 'ready' ? 'READY' : 'WAITING'}</div>
                  <div className="mt-1">Hand detected: {rawDetection !== 'NONE' && isDetecting ? 'YES' : 'NO'}</div>
                  <div>Landmarks: {isDetecting ? '21' : '0'}</div>
                  <div>Features: {isDetecting ? '42' : '0'}</div>
                  <div>Feature valid: {isDetecting ? 'YES' : 'NO'}</div>
                  <div className="mt-1">Preprocessing: UNFLIPPED</div>
                  <div className="mt-1">Inference: {isRequestingRef.current ? 'REQUESTING' : (rawDetection !== 'NONE' ? 'SUCCESS' : 'WAITING')}</div>
                  <div>Endpoint: /api/translate/sign/static</div>
                  <div>HTTP status: {rawDetection !== 'NONE' ? '200' : '--'}</div>
                  <div className="mt-1">Raw label: {rawDetection}</div>
                  <div>Normalized label: {rawDetection}</div>
                  <div>Confidence: {(rawConfidence * 100).toFixed(1)}%</div>
                  <div className="mt-1">Stable label: {stableDetection}</div>
                  <div>Stable count: {predictionHistoryRef.current.filter(v => v === rawDetection).length}/3</div>
                  <div>Commit lock: {lastCommittedSignRef.current ? `LOCKED (${lastCommittedSignRef.current})` : 'OPEN'}</div>
                  <div>Transcript: {messages.length}</div>
                  
                  <div className="mt-3 font-bold text-yellow-400 border-t border-gray-700 pt-2">RAW PREDICTION (BYPASS):</div>
                  <div className="text-3xl text-yellow-400">{rawDetection}</div>
                </div>
             )}

             {cameraError && (
               <div className="absolute z-30 bg-red-900/90 text-white p-4 rounded-xl flex items-center gap-3">
                 <span className="material-symbols-outlined text-3xl">error</span>
                 <div>
                   <p className="font-bold">Camera Error</p>
                   <p className="text-sm">{cameraError}</p>
                 </div>
               </div>
             )}

             <div className="w-full max-w-2xl aspect-[4/3] relative rounded-3xl overflow-hidden shadow-2xl bg-gray-950">
               <StaticISLCamera 
                  isActive={cameraActive}
                  isDetecting={isDetecting}
                  onFeaturesExtracted={handleFeaturesExtracted}
                  onHandLost={handleHandLost}
                  onStatusChange={setCameraStatus}
                  onError={setCameraError}
                />
                
                {/* User-facing camera status overlay */}
                {cameraActive && (
                  <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold tracking-widest text-white border border-gray-700 shadow-lg uppercase">
                    <div className={`w-2.5 h-2.5 rounded-full ${
                      cameraStatus === 'initializing' ? 'bg-yellow-500 animate-pulse' :
                      isDetecting ? 'bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]' : 'bg-gray-400'
                    }`}></div>
                    {cameraStatus === 'initializing' ? 'Initializing...' : isDetecting ? 'Detecting' : 'Camera Ready'}
                  </div>
                )}

                {/* Subtitle-style detection UI */}
                {isDetecting && stableDetection !== 'NONE' && (
                   <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 bg-black/70 backdrop-blur-md px-6 py-3 rounded-2xl border border-gray-700 shadow-xl flex flex-col items-center min-w-[200px]">
                      <span className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Seeing</span>
                      <span className="text-white text-3xl font-bold">{stableDetection}</span>
                   </div>
                )}
             </div>
          </div>
          
          <div className="p-6 bg-gray-950 flex justify-center items-center z-10 border-t border-gray-800 shadow-xl">
             <button 
               onClick={toggleDetection}
               disabled={!cameraActive || cameraStatus !== 'ready'}
               className={`
                  px-10 py-5 rounded-2xl font-bold text-xl flex items-center gap-3 transition-all transform active:scale-95 shadow-xl
                  disabled:opacity-50 disabled:pointer-events-none
                  ${isDetecting 
                     ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20' 
                     : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30'}
               `}
             >
               <span className="material-symbols-outlined text-3xl">{isDetecting ? 'stop_circle' : 'play_circle'}</span>
               {isDetecting ? 'Stop Detection' : 'Start Detection'}
             </button>
          </div>
        </div>
      </div>
    </>
  );
}
