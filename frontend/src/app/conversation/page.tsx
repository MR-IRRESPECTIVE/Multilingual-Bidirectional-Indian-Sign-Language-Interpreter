'use client';

import { useState } from 'react';
import { ConversationMessage } from '@/types';
import CameraPreview from '@/components/camera/CameraPreview';
import AvatarPlaceholder from '@/components/isl/AvatarPlaceholder';
import { mockTranslateTextToISL, mockTranslateISLToText } from '@/lib/api/mockService';

export default function ConversationPage() {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);

  const handleSendText = async () => {
    if (!inputText.trim()) return;
    
    setIsProcessing(true);
    const userMsg: ConversationMessage = {
      id: Date.now().toString(),
      sender: 'userA',
      type: 'text',
      content: inputText,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    
    // Call mock API
    const response = await mockTranslateTextToISL(userMsg.content);
    
    const botMsg: ConversationMessage = {
      id: Date.now().toString() + 'r',
      sender: 'userA',
      type: 'isl',
      content: `[Avatar animates: ${response.gloss.join(' ')}]`,
      gloss: response.gloss,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, botMsg]);
    setIsProcessing(false);
  };

  const handleMockSignDetection = async () => {
    setIsProcessing(true);
    
    const detectedSigns = ['HELLO', 'HOW', 'YOU'];
    const userMsg: ConversationMessage = {
      id: Date.now().toString(),
      sender: 'userB',
      type: 'isl',
      content: `[Detected Signs: ${detectedSigns.join(' ')}]`,
      gloss: detectedSigns,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMsg]);
    
    const response = await mockTranslateISLToText(detectedSigns);
    
    const botMsg: ConversationMessage = {
      id: Date.now().toString() + 'r',
      sender: 'userB',
      type: 'text',
      content: response.translatedText || '',
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, botMsg]);
    setIsProcessing(false);
  };

  return (
    <div className="flex-grow flex flex-col md:flex-row h-[calc(100vh-64px)] overflow-hidden bg-gray-100">
      
      {/* LEFT PANEL: Hearing User (Text/Speech) */}
      <div className="flex-1 flex flex-col border-r border-gray-200 bg-white">
        <div className="p-4 border-b bg-blue-50 text-blue-900 font-medium flex items-center gap-2">
          <span className="material-symbols-outlined">record_voice_over</span>
          English / Hindi Speaker
        </div>
        
        <div className="flex-grow p-4 overflow-y-auto flex flex-col gap-4">
          {messages.filter(m => m.sender === 'userA').map(msg => (
            <div key={msg.id} className={`p-4 rounded-2xl max-w-[85%] ${msg.type === 'text' ? 'bg-blue-600 text-white self-end rounded-tr-sm' : 'bg-gray-100 text-gray-800 self-start rounded-tl-sm'}`}>
              {msg.type === 'isl' ? (
                <div className="flex flex-col gap-2">
                  <AvatarPlaceholder activeGloss={msg.gloss} />
                </div>
              ) : (
                <p>{msg.content}</p>
              )}
            </div>
          ))}
          {isProcessing && <div className="self-start text-sm text-gray-500 flex items-center gap-2"><span className="material-symbols-outlined animate-spin text-sm">progress_activity</span> Processing...</div>}
        </div>
        
        <div className="p-4 border-t bg-gray-50">
          <div className="flex gap-2">
            <button className="p-3 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300">
              <span className="material-symbols-outlined">mic</span>
            </button>
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
              placeholder="Type message..." 
              className="flex-grow px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              onClick={handleSendText}
              className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50"
              disabled={!inputText.trim() || isProcessing}
            >
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: ISL User (Camera) */}
      <div className="flex-1 flex flex-col bg-gray-900 text-white">
        <div className="p-4 border-b border-gray-700 bg-gray-800 font-medium flex items-center gap-2">
          <span className="material-symbols-outlined">sign_language</span>
          ISL Signer
        </div>
        
        <div className="relative flex-grow flex flex-col p-4 gap-4 overflow-y-auto">
          {cameraActive ? (
            <div className="absolute inset-0 z-0">
               <CameraPreview isDetecting={cameraActive} />
            </div>
          ) : (
            <div className="absolute inset-0 z-0 flex flex-col items-center justify-center text-gray-500 bg-gray-950">
              <span className="material-symbols-outlined text-6xl mb-4">videocam_off</span>
              <p>Camera is off</p>
            </div>
          )}

          <div className="z-10 flex-grow flex flex-col justify-end gap-4 pb-16">
            {messages.filter(m => m.sender === 'userB').map(msg => (
              <div key={msg.id} className={`p-4 rounded-2xl max-w-[85%] shadow-lg ${msg.type === 'isl' ? 'bg-black/60 backdrop-blur-md self-end rounded-tr-sm text-yellow-300' : 'bg-white/90 text-gray-900 self-start rounded-tl-sm font-medium'}`}>
                <p>{msg.content}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-4 bg-gray-800 flex justify-between items-center z-10 border-t border-gray-700">
           <button 
             onClick={() => setCameraActive(!cameraActive)}
             className={`px-6 py-3 rounded-full flex items-center gap-2 font-medium transition-colors ${cameraActive ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
           >
             <span className="material-symbols-outlined">{cameraActive ? 'videocam_off' : 'videocam'}</span>
             {cameraActive ? 'Stop Camera' : 'Start Camera'}
           </button>

           {cameraActive && (
             <button 
               onClick={handleMockSignDetection}
               disabled={isProcessing}
               className="px-6 py-3 bg-yellow-500 text-yellow-900 rounded-full font-bold flex items-center gap-2 hover:bg-yellow-400 disabled:opacity-50"
             >
               <span className="material-symbols-outlined">auto_fix</span>
               Mock Detect Sign
             </button>
           )}
        </div>
      </div>
      
    </div>
  );
}
