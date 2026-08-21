'use client';

import { useSettings } from '@/components/accessibility/SettingsProvider';

export default function SettingsPage() {
  const { 
    highContrast, setHighContrast,
    textSize, setTextSize,
    signingSpeed, setSigningSpeed,
    showSubtitles, setShowSubtitles,
    resetSettings
  } = useSettings();

  return (
    <div className="flex-grow p-4 md:p-8 max-w-3xl mx-auto w-full">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-gray-600">Customize your experience for maximum legibility and comfort.</p>
        </div>
        <button 
          onClick={resetSettings}
          className="text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[18px]">restore</span>
          Reset
        </button>
      </div>
      
      <div className="flex flex-col gap-6">
        
        {/* Appearance */}
        <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900">
            <span className="material-symbols-outlined text-blue-600">palette</span>
            Appearance
          </h2>
          
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between py-4 border-b border-gray-50">
              <div>
                <h3 className="font-semibold text-gray-800">High Contrast Mode</h3>
                <p className="text-sm text-gray-500 mt-1">Increases contrast for better readability</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={highContrast}
                  onChange={(e) => setHighContrast(e.target.checked)}
                />
                <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between py-4 border-b border-gray-50">
              <div>
                <h3 className="font-semibold text-gray-800">Text Size</h3>
                <p className="text-sm text-gray-500 mt-1">Adjust the global interface text size</p>
              </div>
              <select 
                value={textSize}
                onChange={(e) => setTextSize(e.target.value as any)}
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-800"
              >
                <option value="small">Small</option>
                <option value="normal">Normal</option>
                <option value="large">Large</option>
                <option value="xlarge">Extra Large</option>
              </select>
            </div>
          </div>
        </section>

        {/* Avatar Settings */}
        <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900">
            <span className="material-symbols-outlined text-blue-600">accessibility_new</span>
            ISL Avatar
          </h2>
          
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 border-b border-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-800">Signing Speed</h3>
                  <p className="text-sm text-gray-500 mt-1">How fast the 3D avatar performs signs</p>
                </div>
                <div className="font-mono font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                  {signingSpeed.toFixed(1)}x
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-400">0.5x</span>
                <input 
                  type="range" 
                  min="0.5" 
                  max="2.0" 
                  step="0.1" 
                  value={signingSpeed}
                  onChange={(e) => setSigningSpeed(parseFloat(e.target.value))}
                  className="flex-grow h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" 
                />
                <span className="text-sm font-medium text-gray-400">2.0x</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between py-4 border-b border-gray-50">
              <div>
                <h3 className="font-semibold text-gray-800">Show Subtitles</h3>
                <p className="text-sm text-gray-500 mt-1">Display translated text below the avatar during playback</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={showSubtitles}
                  onChange={(e) => setShowSubtitles(e.target.checked)}
                />
                <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
