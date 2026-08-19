'use client';

import { useEffect, useRef, useState } from 'react';
import { CameraState } from '@/types';

interface CameraPreviewProps {
  isDetecting?: boolean;
}

export default function CameraPreview({ isDetecting = false }: CameraPreviewProps) {
  const [state, setState] = useState<CameraState>('idle');
  
  useEffect(() => {
    // Mock camera initialization sequence
    setState('requesting');
    
    const timer1 = setTimeout(() => setState('active'), 800);
    const timer2 = setTimeout(() => {
      if (isDetecting) setState('detecting');
    }, 1500);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isDetecting]);

  return (
    <div className="w-full h-full bg-gray-900 relative overflow-hidden flex flex-col items-center justify-center">
      {state === 'requesting' && (
        <div className="text-white flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-4xl animate-pulse">videocam</span>
          <p>Requesting camera permission...</p>
        </div>
      )}
      
      {(state === 'active' || state === 'detecting' || state === 'processing') && (
        <>
          {/* Mock Video Feed Background */}
          <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop')] bg-cover bg-center mix-blend-luminosity"></div>
          
          {/* Mock MediaPipe Skeleton Overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50">
             <svg viewBox="0 0 100 100" className="w-64 h-64 text-green-400 drop-shadow-md">
                <circle cx="50" cy="50" r="4" fill="currentColor" />
                <circle cx="30" cy="30" r="3" fill="currentColor" />
                <circle cx="70" cy="30" r="3" fill="currentColor" />
                <line x1="50" y1="50" x2="30" y2="30" stroke="currentColor" strokeWidth="2" />
                <line x1="50" y1="50" x2="70" y2="30" stroke="currentColor" strokeWidth="2" />
             </svg>
          </div>
          
          {/* Status Overlay */}
          <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-mono">
            <div className={`w-2 h-2 rounded-full ${state === 'detecting' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
            {state === 'detecting' ? 'TRACKING ACTIVE' : 'CAMERA READY'}
          </div>
        </>
      )}
      
      {state === 'error' && (
        <div className="text-red-400 flex flex-col items-center gap-2">
          <span className="material-symbols-outlined text-4xl">error</span>
          <p>Camera access denied or unavailable</p>
        </div>
      )}
    </div>
  );
}
