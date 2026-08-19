'use client';

import { useState } from 'react';
import { mockTranslateTextToISL } from '@/lib/api/mockService';
import AvatarPlaceholder from '@/components/isl/AvatarPlaceholder';

export default function TranslatePage() {
  const [inputText, setInputText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [gloss, setGloss] = useState<string[]>([]);
  
  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    
    setIsTranslating(true);
    setGloss([]);
    
    try {
      const response = await mockTranslateTextToISL(inputText);
      setGloss(response.gloss);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTranslating(false);
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
            placeholder="Type a sentence to translate..."
            className="flex-grow min-h-[200px] p-4 bg-gray-50 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          ></textarea>
          
          <div className="flex justify-between items-center mt-auto">
            <button className="p-3 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors">
              <span className="material-symbols-outlined">mic</span>
            </button>
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
        </div>

        {/* Output Side */}
        <div className="flex flex-col gap-4 bg-gray-900 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-center z-10">
            <h2 className="font-semibold text-lg flex items-center gap-2 text-gray-200">
              <span className="material-symbols-outlined">sign_language</span>
              ISL Output
            </h2>
          </div>
          
          <div className="flex-grow flex flex-col items-center justify-center gap-6 z-10">
            {gloss.length > 0 ? (
              <>
                <div className="w-full max-w-[280px]">
                  <AvatarPlaceholder activeGloss={gloss} />
                </div>
                <div className="bg-white/10 p-4 rounded-xl w-full text-center">
                  <p className="text-sm text-gray-400 mb-1">Generated ISL Gloss</p>
                  <p className="font-mono text-yellow-300 font-bold tracking-wide">{gloss.join(' - ')}</p>
                </div>
              </>
            ) : (
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
