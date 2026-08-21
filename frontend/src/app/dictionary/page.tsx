'use client';

import { useState } from 'react';
import animationRegistry from '@/features/text-to-isl/signkit/Animations/animationRegistry';
import dynamic from 'next/dynamic';

const SignKitPlayer = dynamic(
  () => import('@/features/text-to-isl/signkit/SignKitPlayer'),
  { ssr: false }
);

export default function DictionaryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSign, setSelectedSign] = useState<string | null>(null);

  // Collect words from the registry
  const words = typeof animationRegistry.getRegisteredWords === 'function' 
      ? animationRegistry.getRegisteredWords() 
      : ["HELLO", "THANK YOU", "FOOD", "EAT", "YOU", "I", "SORRY", "YES", "NO"];
  
  const alphabets = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
  const numbers = Array.from({ length: 10 }, (_, i) => i.toString());

  const allSigns = [...words, ...alphabets, ...numbers].map(w => w.toUpperCase());
  
  // Filter out any duplicates and apply search
  const filteredSigns = Array.from(new Set(allSigns)).filter(sign => {
    if (!sign.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    
    // Presentation Safety Pass: completely hide known broken animations from the list
    const KNOWN_BROKEN = ['A', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'UNKNOWN_WORD'];
    if (KNOWN_BROKEN.includes(sign.toUpperCase())) return false;
    
    const inRegistry = typeof animationRegistry.hasAnimation === 'function' 
        ? animationRegistry.hasAnimation(sign) 
        : true;
    
    return inRegistry;
  }).sort();

  return (
    <div className="flex-grow p-4 md:p-8 max-w-6xl mx-auto w-full flex flex-col">
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-4 text-gray-900">ISL Dictionary</h1>
        <p className="text-lg text-gray-600 mb-8">
          Explore Indian Sign Language vocabulary. Click any sign to watch how it is performed by the avatar.
        </p>
        
        <div className="relative max-w-lg mx-auto">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-2xl">search</span>
          <input
            type="text"
            placeholder="Search signs, letters, or numbers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-gray-200 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-lg transition-all"
          />
        </div>
      </div>

      {filteredSigns.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center text-gray-400 py-12">
          <span className="material-symbols-outlined text-6xl mb-4">search_off</span>
          <p className="text-xl font-medium text-gray-600">No signs found for "{searchTerm}"</p>
          <p className="mt-2 text-sm">Try a different search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredSigns.map((sign, idx) => {
            return (
              <div 
                key={sign + idx} 
                className="bg-white rounded-2xl border border-gray-100 hover:shadow-md hover:border-blue-200 shadow-sm transition-all overflow-hidden flex flex-col group"
              >
                <div className="flex-grow flex items-center justify-center p-6 bg-gray-50 group-hover:bg-blue-50/30 transition-colors">
                  <span className="text-xl font-bold text-center text-gray-800">{sign}</span>
                </div>
                <button
                  onClick={() => setSelectedSign(sign)}
                  className="py-3 px-2 flex items-center justify-center gap-1 font-medium text-sm transition-colors bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    play_circle
                  </span>
                  Play Sign
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Playback Modal */}
      {selectedSign && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-200">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600">sign_language</span>
                {selectedSign}
              </h3>
              <button 
                onClick={() => setSelectedSign(null)}
                className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-full transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="w-full h-[60vh] bg-gray-900">
              <SignKitPlayer gloss={[selectedSign]} unsupportedWords={[]} hideSequence={true} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
