'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { SignData } from '@/types';

interface SignVideoPlayerProps {
  signs: SignData[];
  autoPlay?: boolean;
}

export default function SignVideoPlayer({ signs, autoPlay = true }: SignVideoPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Reset to first sign when signs array changes
  useEffect(() => {
    setCurrentIndex(0);
    setVideoError(false);
  }, [signs]);
  
  // Reset video error when index changes
  useEffect(() => {
    setVideoError(false);
  }, [currentIndex]);
  
  if (signs.length === 0) return null;
  
  const currentSign = signs[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === signs.length - 1;
  
  const handlePrevious = () => {
    if (!isFirst) setCurrentIndex(prev => prev - 1);
  };
  
  const handleNext = () => {
    if (!isLast) setCurrentIndex(prev => prev + 1);
  };
  
  const handleReplay = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };
  
  const handleVideoEnded = () => {
    if (autoPlay && !isLast) {
      // Small delay before advancing for visual clarity
      setTimeout(() => handleNext(), 300);
    }
  };
  
  const handleVideoError = () => {
    setVideoError(true);
  };
  
  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Gloss Sequence Bar */}
      <div className="flex flex-wrap gap-2 justify-center">
        {signs.map((sign, idx) => (
          <span
            key={sign.id + '-' + idx}
            className={`px-3 py-1 rounded-full text-sm font-mono font-semibold transition-colors ${
              idx === currentIndex
                ? 'bg-yellow-400/20 text-yellow-300'
                : 'bg-white/10 text-gray-400'
            }`}
          >
            {sign.label.toUpperCase()}
          </span>
        ))}
      </div>
      
      {/* Current Sign Label */}
      <h3 className="text-2xl font-bold text-white">{currentSign.label}</h3>
      
      {/* Video Area */}
      <div className="w-full max-w-[360px] aspect-[4/3] bg-white/5 rounded-2xl overflow-hidden flex items-center justify-center">
        {videoError ? (
          <div className="flex flex-col items-center text-gray-400 p-6 text-center">
            <span className="material-symbols-outlined text-4xl mb-3">videocam_off</span>
            <p className="font-semibold">Sign video not available yet</p>
            <p className="text-sm text-gray-500 mt-1">Waiting for recorded video of “{currentSign.label}”</p>
          </div>
        ) : (
          <video
            ref={videoRef}
            key={currentSign.id}
            src={currentSign.video_url}
            autoPlay={autoPlay}
            playsInline
            className="w-full h-full object-contain"
            onEnded={handleVideoEnded}
            onError={handleVideoError}
          />
        )}
      </div>
      
      {/* Progress */}
      <p className="text-gray-400 text-sm">
        {currentIndex + 1} / {signs.length}
      </p>
      
      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={handlePrevious}
          disabled={isFirst}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Previous sign"
        >
          <span className="material-symbols-outlined">skip_previous</span>
        </button>
        
        <button
          onClick={handleReplay}
          className="p-3 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
          aria-label="Replay sign"
        >
          <span className="material-symbols-outlined">replay</span>
        </button>
        
        <button
          onClick={handleNext}
          disabled={isLast}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Next sign"
        >
          <span className="material-symbols-outlined">skip_next</span>
        </button>
      </div>
    </div>
  );
}
