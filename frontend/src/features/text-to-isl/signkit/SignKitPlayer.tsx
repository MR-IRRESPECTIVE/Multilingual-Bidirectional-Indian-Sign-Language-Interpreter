'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
// @ts-ignore
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import animationRegistry from './Animations/animationRegistry';
import { defaultPose } from './Animations/defaultPose';
import { useSettings } from '@/components/accessibility/SettingsProvider';

interface SignKitPlayerProps {
  gloss: string[];
  unsupportedWords: string[];
  hideSequence?: boolean;
}

type PlaybackState = 'IDLE' | 'LOADING' | 'PLAYING' | 'PAUSED' | 'FINISHED';

export default function SignKitPlayer({ gloss, unsupportedWords, hideSequence = false }: SignKitPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { signingSpeed } = useSettings();
  
  // Animation state kept out of React renders for performance
  const componentRef = useRef<any>({
    animations: [],
    characters: [], // REQUIRED by defaultPose.js
    flag: false,
    pending: false,
    speed: 0.1, // Base speed
    pause: 150, // Reduced from 800ms to 150ms for natural fluidity
    scene: null,
    renderer: null,
    camera: null,
    avatar: null,
    rafId: null,
    isPaused: false, // Internal pause flag to halt the loop
    onSignComplete: null // Callback when a sign finishes
  });

  const [playbackState, setPlaybackState] = useState<PlaybackState>('LOADING');
  const [currentSignIndex, setCurrentSignIndex] = useState(-1);
  const [fps, setFps] = useState(0);

  const { current: ref } = componentRef;
  
  // Apply Settings Speed
  useEffect(() => {
    // 0.1 is the original SignKit speed. We multiply by user setting (e.g. 0.5 to 1.5)
    ref.speed = 0.1 * signingSpeed;
  }, [signingSpeed, ref]);

  // Mount Three.js
  useEffect(() => {
    if (!containerRef.current) return;

    ref.pause = 800;  // RESTORE ORIGINAL SIGNKIT PAUSE TIMING (800ms) for timing sync

    const container = containerRef.current;
    
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x11111a); // Darker, cleaner background
    
    // Improved Lighting for Avatar Visibility
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2); 
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(0, 10, 10);
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
    fillLight.position.set(-10, 0, 5);
    scene.add(fillLight);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 1000);
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Better camera framing
    camera.position.set(0, 1.35, 1.8);
    camera.lookAt(0, 1.3, 0);

    container.appendChild(renderer.domElement);
    
    ref.scene = scene;
    ref.renderer = renderer;
    ref.camera = camera;
    ref.rafId = null;

    const loader = new GLTFLoader();
    loader.load(
      '/models/ybot.glb',
      (gltf: any) => {
        gltf.scene.traverse((child: any) => {
          if (child.type === 'SkinnedMesh') {
            child.frustumCulled = false;
            if (child.material) {
              child.material.metalness = 0.1;
              child.material.roughness = 0.5;
            }
          }
        });
        ref.avatar = gltf.scene;
        scene.add(ref.avatar);
        defaultPose(ref);
        
        renderer.render(scene, camera);
        setPlaybackState('IDLE');
      },
      undefined,
      (error: any) => {
        console.error("Error loading avatar:", error);
        setPlaybackState('IDLE');
      }
    );

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.render(scene, camera);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (ref.rafId) {
        cancelAnimationFrame(ref.rafId);
        ref.rafId = null;
      }
      ref.animations = [];
      ref.pending = false;
      if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      ref.scene = null;
      ref.renderer = null;
      ref.camera = null;
      ref.avatar = null;
    };
  }, []);

  const timeRef = useRef({ last: typeof performance !== 'undefined' ? performance.now() : 0, frames: 0 });

  useEffect(() => {
    ref.animate = () => {
      if (ref.isPaused) {
        ref.rafId = requestAnimationFrame(ref.animate);
        if (ref.renderer && ref.scene && ref.camera) {
          ref.renderer.render(ref.scene, ref.camera);
        }
        return;
      }

      if (ref.animations.length === 0) {
        if (ref.onSignComplete) ref.onSignComplete();
        return;
      }
      
      ref.rafId = requestAnimationFrame(ref.animate);
      
      const now = performance.now();
      timeRef.current.frames++;
      if (now - timeRef.current.last >= 1000) {
        setFps(timeRef.current.frames);
        timeRef.current.frames = 0;
        timeRef.current.last = now;
      }
      
      if (ref.animations[0].length) {
        if (!ref.flag) {
          for (let i = 0; i < ref.animations[0].length;) {
            let [boneName, action, axis, limit, sign] = ref.animations[0][i];
            
            const bone = ref.avatar.getObjectByName(boneName);
            if (!bone) {
                ref.animations[0].splice(i, 1);
                continue;
            }

            if (sign === "+" && bone[action][axis] < limit) {
              bone[action][axis] += ref.speed;
              bone[action][axis] = Math.min(bone[action][axis], limit);
              i++;
            }
            else if (sign === "-" && bone[action][axis] > limit) {
              bone[action][axis] -= ref.speed;
              bone[action][axis] = Math.max(bone[action][axis], limit);
              i++;
            }
            else {
              ref.animations[0].splice(i, 1);
            }
          }
        }
      } else {
        ref.flag = true;
        setTimeout(() => { ref.flag = false; }, ref.pause);
        ref.animations.shift();
      }
      
      if (ref.renderer && ref.scene && ref.camera) {
        ref.renderer.render(ref.scene, ref.camera);
      }
    };
  }, []);

  const playWord = (index: number) => {
    if (!ref.avatar) return;
    if (index >= gloss.length) {
      setPlaybackState('FINISHED');
      setCurrentSignIndex(-1);
      defaultPose(ref);
      ref.renderer.render(ref.scene, ref.camera);
      if (ref.rafId) {
        cancelAnimationFrame(ref.rafId);
        ref.rafId = null;
      }
      return;
    }

    const word = gloss[index];
    ref.animations = [];
    ref.flag = false;
    ref.pending = false;
    ref.isPaused = false;
    
    defaultPose(ref);

    const animation = animationRegistry.getAnimation(word);
    if (animation) {
      animation(ref);
    } else {
      for (const ch of word.split('')) {
        const charAnimation = animationRegistry.getAnimation(ch);
        if (charAnimation) charAnimation(ref);
      }
    }

    setPlaybackState('PLAYING');
    setCurrentSignIndex(index);
    
    ref.onSignComplete = () => {
      setTimeout(() => { playWord(index + 1); }, 300);
    };

    if (ref.rafId) cancelAnimationFrame(ref.rafId);
    ref.animate();
  };

  const handlePlay = () => {
    if (playbackState === 'PAUSED') {
      ref.isPaused = false;
      setPlaybackState('PLAYING');
    } else {
      playWord(0);
    }
  };

  const handlePause = () => {
    ref.isPaused = true;
    setPlaybackState('PAUSED');
  };

  const handleRestart = () => playWord(0);
  
  const handleNext = () => {
    if (currentSignIndex < gloss.length - 1) playWord(currentSignIndex + 1);
    else playWord(gloss.length);
  };

  const handlePrevious = () => {
    if (currentSignIndex > 0) playWord(currentSignIndex - 1);
    else playWord(0);
  };

  useEffect(() => {
    if (gloss.length > 0 && playbackState !== 'LOADING') {
      playWord(0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gloss]);

  return (
    <div className="w-full h-full flex flex-col items-center relative">
      <div 
        ref={containerRef} 
        className="w-full h-full flex-grow bg-[#11111a] flex items-center justify-center relative rounded-b-3xl xl:rounded-3xl xl:rounded-t-none"
        style={{ minHeight: '400px' }}
      >
        {playbackState === 'LOADING' && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#11111a] z-10">
            <div className="flex flex-col items-center">
              <span className="material-symbols-outlined animate-spin text-4xl text-blue-500 mb-3">sync</span>
              <p className="text-blue-300 font-medium tracking-wide">Initializing ISL Engine...</p>
            </div>
          </div>
        )}
        
        {process.env.NEXT_PUBLIC_SIGNKIT_DEBUG === 'true' && (
          <div className="absolute top-4 left-4 bg-black/80 text-green-400 text-xs font-mono p-2 rounded z-20">
            FPS: {fps} <br/>
            State: {playbackState} <br/>
            Index: {currentSignIndex} <br/>
            Speed: {signingSpeed}x
          </div>
        )}
        
        {playbackState === 'PAUSED' && (
          <div className="absolute top-4 right-4 bg-yellow-500/90 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg z-20 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">pause</span> Paused
          </div>
        )}
      </div>
      
      {/* Bottom overlay with controls and sequence */}
      <div className="absolute bottom-4 left-4 right-4 bg-gray-900/80 backdrop-blur-md border border-gray-700/50 rounded-2xl p-4 flex flex-col gap-3 shadow-xl z-20">
        
        {!hideSequence && gloss.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
            {gloss.map((word, idx) => (
              <div 
                key={word + idx}
                className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                  idx === currentSignIndex
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 ring-2 ring-blue-400'
                    : idx < currentSignIndex
                      ? 'bg-gray-800 text-gray-400'
                      : 'bg-gray-800 text-gray-500'
                }`}
              >
                {word}
              </div>
            ))}
            {unsupportedWords.length > 0 && (
              <div className="ml-2 pl-2 border-l border-gray-700 flex gap-1">
                 {unsupportedWords.map((word, idx) => (
                    <span key={word+idx} className="px-2 py-1 text-xs font-mono bg-orange-500/10 text-orange-400 rounded" title="Fingerspelling Fallback">
                       {word}
                    </span>
                 ))}
              </div>
            )}
          </div>
        )}
        
        <div className="flex justify-between items-center px-2">
          
          <div className="flex-1 flex justify-start">
             <button 
               onClick={handleRestart}
               disabled={playbackState === 'LOADING' || gloss.length === 0}
               className="flex items-center gap-1 text-sm font-medium text-gray-400 hover:text-white disabled:opacity-30 transition-colors py-1 px-2 rounded hover:bg-gray-800"
             >
               <span className="material-symbols-outlined text-[18px]">replay</span>
               Restart
             </button>
          </div>
          
          <div className="flex justify-center items-center gap-4">
            <button 
              onClick={handlePrevious}
              disabled={playbackState === 'LOADING' || gloss.length === 0}
              className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 disabled:opacity-30 flex items-center justify-center text-gray-300 transition-colors"
            >
              <span className="material-symbols-outlined text-xl">skip_previous</span>
            </button>
            
            {playbackState === 'PLAYING' ? (
              <button 
                onClick={handlePause}
                className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center text-white transition-transform active:scale-95 shadow-[0_0_15px_rgba(37,99,235,0.5)]"
              >
                <span className="material-symbols-outlined text-2xl">pause</span>
              </button>
            ) : (
              <button 
                onClick={handlePlay}
                disabled={playbackState === 'LOADING' || gloss.length === 0}
                className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:shadow-none flex items-center justify-center text-white transition-transform active:scale-95 shadow-[0_0_15px_rgba(37,99,235,0.5)]"
              >
                <span className="material-symbols-outlined text-2xl">play_arrow</span>
              </button>
            )}
            
            <button 
              onClick={handleNext}
              disabled={playbackState === 'LOADING' || gloss.length === 0}
              className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 disabled:opacity-30 flex items-center justify-center text-gray-300 transition-colors"
            >
              <span className="material-symbols-outlined text-xl">skip_next</span>
            </button>
          </div>
          
          <div className="flex-1 flex justify-end text-xs text-gray-500 font-medium">
             Speed {signingSpeed}x
          </div>
          
        </div>
      </div>
    </div>
  );
}
