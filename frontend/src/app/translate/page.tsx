'use client';

import { useState, useEffect } from 'react';
import { SignData, TextToSignResponse } from '@/types';
import { apiPost, ApiError } from '@/lib/api/apiClient';
import SignVideoPlayer from '@/components/isl/SignVideoPlayer';
import { useVoiceInput } from '@/lib/speech/useVoiceInput';

export default function TranslatePage() {
  const [inputText, setInputText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [signs, setSigns] = useState<SignData[]>([]);
  const [gloss, setGloss] = useState<string[]>([]);
  const [unsupportedWords, setUnsupportedWords] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasTranslated, setHasTranslated] = useState(false);
  
  const voice = useVoiceInput();
  
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
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
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
    <div className="flex-grow flex flex-col p-4 md:p-8 max-w-5xl mx-auto w-full gap-8">
      
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Quick Translate</h1>
        <p className="text-gray-600">Convert English or Hindi text into Indian Sign Language.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
        
        {/* Input Side */}
        <div className="flex flex-col gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-lg flex items-center gap-2 text-blue-900">
              <span className="material-symbols-outlined">text_fields</span>
              Text Input
            </h2>
            <select className="bg-gray-100 border-none rounded-lg text-sm px-3 py-1 outline-none focus:ring-2 focus:ring-blue-500">
              <option value="en">English</option>
              <option value="hi">Hindi</option>
            </select>
          </div>
          
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a sentence to translate..."
            className="flex-grow min-h-[200px] p-4 bg-gray-50 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          ></textarea>
          
          <div className="flex justify-between items-center mt-auto">
            <div className="flex items-center gap-2">
              <button
                onClick={voice.isListening ? voice.stopListening : voice.startListening}
                disabled={!voice.isSupported}
                className={`p-3 rounded-full transition-colors ${
                  voice.isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : voice.isSupported
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                title={!voice.isSupported ? 'Speech recognition not available in this browser' : voice.isListening ? 'Stop listening' : 'Start voice input'}
              >
                <span className="material-symbols-outlined">
                  {voice.isListening ? 'mic' : 'mic'}
                </span>
              </button>
              {voice.isListening && (
                <span className="text-sm text-red-500 font-medium">Listening...</span>
              )}
            </div>
            <button 
              onClick={handleTranslate}
              disabled={!inputText.trim() || isTranslating}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isTranslating ? (
                <><span className="material-symbols-outlined animate-spin text-sm">progress_activity</span> Processing</>
              ) : (
                'Translate'
              )}
            </button>
          </div>
          
          {/* Voice error message */}
          {voice.error && (
            <p className="text-sm text-red-500 mt-1">{voice.error}</p>
          )}
        </div>

        {/* Output Side */}
        <div className="flex flex-col gap-4 bg-gray-900 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-center z-10">
            <h2 className="font-semibold text-lg flex items-center gap-2 text-gray-200">
              <span className="material-symbols-outlined">sign_language</span>
              ISL Output
            </h2>
          </div>
          
          <div className="flex-grow flex flex-col items-center justify-center gap-4 z-10">
            {/* Error State */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 w-full text-center">
                <span className="material-symbols-outlined text-3xl text-red-400 mb-2">report_problem</span>
                <p className="text-red-300">{error}</p>
              </div>
            )}
            
            {/* Success: Signs found */}
            {!error && hasTranslated && signs.length > 0 && (
              <SignVideoPlayer signs={signs} />
            )}
            
            {/* Success: No signs found at all */}
            {!error && hasTranslated && signs.length === 0 && unsupportedWords.length > 0 && (
              <div className="flex flex-col items-center text-gray-400 p-6 text-center">
                <span className="material-symbols-outlined text-5xl mb-3">search_off</span>
                <p className="font-semibold text-lg">No signs available</p>
                <p className="text-sm text-gray-500 mt-1">None of the entered words have ISL signs recorded yet.</p>
              </div>
            )}
            
            {/* Unsupported words notice */}
            {!error && hasTranslated && unsupportedWords.length > 0 && (
              <div className="bg-white/5 rounded-xl p-4 w-full">
                <p className="text-sm text-gray-400 mb-2">
                  <span className="material-symbols-outlined text-sm align-middle mr-1">info</span>
                  Words not yet available:
                </p>
                <div className="flex flex-wrap gap-2">
                  {unsupportedWords.map((word, idx) => (
                    <span
                      key={word + '-' + idx}
                      className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-sm font-mono"
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Empty State (no translation attempted) */}
            {!error && !hasTranslated && (
              <div className="flex flex-col items-center text-gray-500 opacity-60">
                <span className="material-symbols-outlined text-6xl mb-4">accessibility</span>
                <p>Enter text to see ISL translation</p>
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}
