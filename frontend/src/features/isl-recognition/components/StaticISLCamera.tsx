'use client';

import React, { useEffect, useRef, useState } from 'react';
import { processStatic42Features } from '@/utils/landmark_processing';

export interface StaticISLCameraProps {
  isActive: boolean;
  isDetecting: boolean;
  onFeaturesExtracted?: (features: number[]) => void;
  onHandLost?: () => void;
  onError?: (err: string) => void;
  onStatusChange?: (status: 'idle' | 'initializing' | 'ready' | 'error') => void;
}

export default function StaticISLCamera({
  isActive,
  isDetecting,
  onFeaturesExtracted,
  onHandLost,
  onError,
  onStatusChange
}: StaticISLCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Core mutable state
  const streamRef = useRef<MediaStream | null>(null);
  const handsRef = useRef<any>(null);
  const rafIdRef = useRef<number | null>(null);
  const isMountedRef = useRef(true);

  // Sync state refs for callbacks
  const isDetectingRef = useRef(isDetecting);
  const onFeaturesExtractedRef = useRef(onFeaturesExtracted);
  const onHandLostRef = useRef(onHandLost);

  useEffect(() => {
    isDetectingRef.current = isDetecting;
  }, [isDetecting]);

  useEffect(() => {
    onFeaturesExtractedRef.current = onFeaturesExtracted;
    onHandLostRef.current = onHandLost;
  }, [onFeaturesExtracted, onHandLost]);

  useEffect(() => {
    isMountedRef.current = true;

    if (!isActive) {
      cleanup();
      if (onStatusChange) onStatusChange('idle');
      return;
    }

    if (onStatusChange) onStatusChange('initializing');
    let isMediaPipeReady = false;

    // 1. Initialize MediaPipe
    const initMediaPipe = () => {
      // @ts-ignore
      if (!window.Hands || !window.drawConnectors) {
        if (isMountedRef.current) setTimeout(initMediaPipe, 500);
        return;
      }

      try {
        // @ts-ignore
        const hands = new window.Hands({
          locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
        });

        hands.setOptions({
          maxNumHands: 1, // static_v1 trained on 1 hand
          modelComplexity: 1,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        });

        hands.onResults((results: any) => {
          if (!isMountedRef.current || !isActive) return;

          const canvas = canvasRef.current;
          const ctx = canvas?.getContext('2d');
          if (!canvas || !ctx) return;

          // Clear canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            const landmarks = results.multiHandLandmarks[0];

            // Draw Landmarks (Visual only, mirrored via CSS)
            // @ts-ignore
            window.drawConnectors(ctx, landmarks, window.HAND_CONNECTIONS, { color: '#00FF00', lineWidth: 3 });
            // @ts-ignore
            window.drawLandmarks(ctx, landmarks, { color: '#FF0000', lineWidth: 1, radius: 3 });

            // Extract Features if detecting
            if (isDetectingRef.current) {
              try {
                // EXTREMELY IMPORTANT:
                // Using the UNFLIPPED variant per the empirical A/B experiment results on production webcams
                const features = processStatic42Features(landmarks, canvas.width, canvas.height);
                if (onFeaturesExtractedRef.current) {
                  onFeaturesExtractedRef.current(features);
                }
              } catch (err) {
                // Silent catch for NaN or invalid landmarks during extraction
              }
            }
          } else {
            // No hands detected
            if (isDetectingRef.current && onHandLostRef.current) {
              onHandLostRef.current();
            }
          }
        });

        handsRef.current = hands;
        isMediaPipeReady = true;
        startCamera();
      } catch (err) {
        if (onError) onError("Failed to initialize MediaPipe.");
        if (onStatusChange) onStatusChange('error');
      }
    };

    // 2. Start Camera
    const startCamera = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        if (onError) onError("Camera access is not supported in this browser.");
        if (onStatusChange) onStatusChange('error');
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
          audio: false
        });

        if (!isMountedRef.current || !isActive) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            if (videoRef.current) {
              videoRef.current.play().then(() => {
                if (onStatusChange) onStatusChange('ready');
                startRenderLoop();
              });
            }
          };
        }
      } catch (err: any) {
        if (onError) onError(`Camera error: ${err.message || err.name}`);
        if (onStatusChange) onStatusChange('error');
      }
    };

    // 3. Render Loop
    const startRenderLoop = async () => {
      if (!isMountedRef.current || !isActive) return;

      const video = videoRef.current;
      if (video && video.readyState >= 2 && video.videoWidth > 0) {
        if (canvasRef.current) {
          canvasRef.current.width = video.videoWidth;
          canvasRef.current.height = video.videoHeight;
        }
        if (handsRef.current && isMediaPipeReady) {
          try {
            await handsRef.current.send({ image: video });
          } catch (e) {}
        }
      }

      rafIdRef.current = requestAnimationFrame(startRenderLoop);
    };

    initMediaPipe();

    return () => {
      isMountedRef.current = false;
      cleanup();
    };
  }, [isActive]);

  const cleanup = () => {
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (handsRef.current) {
      try { handsRef.current.close(); } catch (e) {}
      handsRef.current = null;
    }
  };

  return (
    <div className="relative w-full h-full bg-black rounded-3xl overflow-hidden shadow-2xl border border-gray-800 flex items-center justify-center">
      {/* Visual rendering is mirrored (-scale-x-100) purely for user comfort. */}
      {/* The mathematical X inversion for the model is handled by processStatic42FeaturesFlipped */}
      <video
        ref={videoRef}
        playsInline
        muted
        className={`absolute inset-0 w-full h-full object-cover transform -scale-x-100 transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}
      />
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full object-cover transform -scale-x-100 pointer-events-none z-10 transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}
      />
      
      {!isActive && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-gray-500 z-20">
          <span className="material-symbols-outlined text-6xl mb-4">videocam_off</span>
          <p className="font-medium text-lg">Camera is off</p>
          <p className="text-sm mt-1">Start camera to begin ISL translation</p>
        </div>
      )}
    </div>
  );
}
