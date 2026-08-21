'use client';

import { useState, useEffect } from 'react';
import { SignData, TextToSignResponse } from '@/types';
import { apiPost, ApiError } from '@/lib/api/apiClient';
import dynamic from 'next/dynamic';
import { useVoiceInput } from '@/lib/speech/useVoiceInput';
import { useSettings } from '@/components/accessibility/SettingsProvider';

// Dynamically import SignKitPlayer so Three.js doesn't break SSR
const SignKitPlayer = dynamic(
  () => import('@/features/text-to-isl/signkit/SignKitPlayer'),
  { ssr: false }
);

export default function TranslatePage() {
  const [inputText, setInputText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [signs, setSigns] = useState<SignData[]>([]);
  const [gloss, setGloss] = useState<string[]>([]);
  const [unsupportedWords, setUnsupportedWords] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasTranslated, setHasTranslated] = useState(false);
  
  const voice = useVoiceInput();
  const { showSubtitles } = useSettings();
  
  // When voice transcript arrives, populate the text input
  useEffect(() => {
    if (voice.transcript) {
      setInputText(voice.transcript);
    }
  }, [voice.transcript]);
  
  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    
    setIsTranslating(true);
    setError(null);
    setSigns([]);
    setGloss([]);
    setUnsupportedWords([]);
    
    try {
      const response = await apiPost<TextToSignResponse>(
        '/api/translate/text-to-sign',
        { text: inputText }
      );
      setSigns(response.signs);
      setGloss(response.gloss);
      setUnsupportedWords(response.unsupported_words || []);
    } catch (err) {
      // Presentation safety pass: hide raw API errors
      setError('Something went wrong. Please try again.');
    } finally {
      setIsTranslating(false);
      setHasTranslated(true);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTranslate();
    }
  };

  return (
    <div className="flex-grow flex flex-col p-4 md:p-8 max-w-7xl mx-auto w-full gap-6">
      
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-gray-900">Text to ISL</h1>
        <p className="text-gray-600">Convert English text into Indian Sign Language.</p>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 flex-grow">
        
        {/* LEFT: Input Side (40%) */}
        <div className="xl:col-span-2 flex flex-col gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center pb-2 border-b border-gray-100">
            <h2 className="font-semibold text-lg flex items-center gap-2 text-blue-900">
              <span className="material-symbols-outlined">text_fields</span>
              Input
            </h2>
            <select className="bg-gray-100 border-none rounded-lg text-sm px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-700">
              <option value="en">English</option>
            </select>
          </div>
          
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a sentence to translate..."
            className="flex-grow min-h-[150px] xl:min-h-[250px] p-4 bg-gray-50 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg border border-gray-100"
            aria-label="Text to translate"
          ></textarea>
          
          <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <button
                onClick={voice.isListening ? voice.stopListening : voice.startListening}
                disabled={!voice.isSupported}
                className={`p-3.5 rounded-full transition-all shadow-sm ${
                  voice.isListening
                    ? 'bg-red-500 text-white animate-pulse shadow-red-500/30'
                    : voice.isSupported
                      ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 hover:scale-105'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                title={!voice.isSupported ? 'Speech recognition not available in this browser' : voice.isListening ? 'Stop listening' : 'Use voice input'}
                aria-label="Voice input"
              >
                <span className="material-symbols-outlined text-xl">
                  {voice.isListening ? 'mic' : 'mic'}
                </span>
              </button>
              {voice.isListening && (
                <span className="text-sm text-red-500 font-bold tracking-wide">Listening...</span>
              )}
            </div>
            
            <button 
              onClick={handleTranslate}
              disabled={!inputText.trim() || isTranslating}
              className="px-8 py-3.5 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95"
            >
              {isTranslating ? (
                <><span className="material-symbols-outlined animate-spin text-sm">progress_activity</span> Translating</>
              ) : (
                <>Translate <span className="material-symbols-outlined text-sm">arrow_forward</span></>
              )}
            </button>
          </div>
          
          {voice.error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm flex items-center gap-2 mt-2">
              <span className="material-symbols-outlined text-base">error</span>
              {voice.error}
            </div>
          )}
        </div>

        {/* RIGHT: Output Side (60%) */}
        <div className="xl:col-span-3 flex flex-col bg-gray-900 text-white rounded-3xl shadow-xl relative overflow-hidden border border-gray-800 h-[600px] xl:h-auto">
          
          {/* Header */}
          <div className="p-4 bg-gray-950/80 backdrop-blur-md flex justify-between items-center z-20 border-b border-gray-800 absolute top-0 w-full">
            <h2 className="font-semibold text-lg flex items-center gap-2 text-gray-200 tracking-wide">
              <span className="material-symbols-outlined text-blue-400">3d_rotation</span>
              ISL Viewer
            </h2>
          </div>
          
          <div className="flex-grow flex flex-col items-center justify-center w-full h-full relative">
            {/* Error State */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 m-6 text-center max-w-md">
                <span className="material-symbols-outlined text-4xl text-red-400 mb-3">report_problem</span>
                <p className="text-red-200 font-medium">{error}</p>
              </div>
            )}
            
            {/* Success: Show SignKit Player */}
            {!error && hasTranslated && (
              <div className="w-full h-full flex flex-col">
                <SignKitPlayer gloss={gloss} unsupportedWords={unsupportedWords} />
              </div>
            )}
            
            {/* Empty State */}
            {!error && !hasTranslated && (
              <div className="flex flex-col items-center text-gray-500 opacity-60">
                <span className="material-symbols-outlined text-6xl mb-4 text-gray-600">accessibility</span>
                <p className="font-medium text-lg text-gray-400">ISL avatar will appear here</p>
                <p className="text-sm mt-1">Enter text to begin translation</p>
              </div>
            )}
          </div>
          
          {/* Subtitles Overlay */}
          {hasTranslated && showSubtitles && (
             <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-md px-6 py-2 rounded-full text-white text-lg font-medium shadow-lg border border-gray-700 pointer-events-none z-20 whitespace-nowrap max-w-[90%] overflow-hidden text-ellipsis">
               "{inputText}"
             </div>
          )}
          
        </div>
        
      </div>
    </div>
  );
}
