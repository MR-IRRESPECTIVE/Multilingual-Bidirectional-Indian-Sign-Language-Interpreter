'use client';

export default function SettingsPage() {
  return (
    <div className="flex-grow p-4 md:p-8 max-w-3xl mx-auto w-full">
      <h1 className="text-3xl font-bold mb-2">Accessibility Settings</h1>
      <p className="text-gray-600 mb-8">Customize your experience for maximum legibility and comfort.</p>
      
      <div className="flex flex-col gap-6">
        
        {/* Appearance */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600">palette</span>
            Appearance
          </h2>
          
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <div>
                <h3 className="font-medium">High Contrast Mode</h3>
                <p className="text-sm text-gray-500">Increases contrast for better readability</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <div>
                <h3 className="font-medium">Text Size</h3>
                <p className="text-sm text-gray-500">Adjust the global interface text size</p>
              </div>
              <select className="bg-gray-100 border-none rounded-lg px-3 py-2 outline-none">
                <option>Normal</option>
                <option>Large</option>
                <option>Extra Large</option>
              </select>
            </div>
          </div>
        </section>

        {/* Avatar Settings */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600">accessibility_new</span>
            ISL Avatar
          </h2>
          
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <div>
                <h3 className="font-medium">Signing Speed</h3>
                <p className="text-sm text-gray-500">How fast the 3D avatar performs signs</p>
              </div>
              <input type="range" min="1" max="100" defaultValue="50" className="w-32 accent-blue-600" />
            </div>
            
            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <div>
                <h3 className="font-medium">Show English/Hindi Subtitles</h3>
                <p className="text-sm text-gray-500">Display translated text below the avatar</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
