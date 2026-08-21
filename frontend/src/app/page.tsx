import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex-grow flex flex-col w-full bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center p-8 md:p-16 text-center">
        <div className="max-w-3xl flex flex-col items-center gap-6">
          <div className="bg-blue-100 p-6 rounded-full text-blue-700 shadow-sm border border-blue-200">
            <span className="material-symbols-outlined text-6xl">waving_hand</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
            Speak. Sign. <span className="text-blue-600">Understand.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl font-medium leading-relaxed">
            A bidirectional AI interpreter helping bridge communication between English speakers and the Indian Sign Language community.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto">
            <Link href="/conversation" className="flex-1 sm:flex-none flex items-center justify-center gap-3 bg-blue-600 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              <span className="material-symbols-outlined">forum</span>
              Start Conversation
            </Link>
            <Link href="/translate" className="flex-1 sm:flex-none flex items-center justify-center gap-3 bg-white text-gray-800 border-2 border-gray-200 px-10 py-5 rounded-2xl font-bold text-xl hover:border-blue-300 hover:bg-blue-50 transition-colors shadow-sm transform hover:-translate-y-1">
              <span className="material-symbols-outlined text-blue-600">translate</span>
              Quick Translate
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16 px-6 bg-white border-t border-gray-100 w-full flex-grow">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">How it works</h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            
            {/* Speak/Type -> ISL */}
            <div className="flex flex-col gap-4 p-8 rounded-3xl bg-blue-50 border border-blue-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <span className="material-symbols-outlined text-9xl">3d_rotation</span>
              </div>
              <div className="z-10">
                <span className="inline-block px-4 py-1 bg-blue-600 text-white font-bold text-sm rounded-full tracking-wider mb-4 uppercase">
                  Text to Sign
                </span>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Speak or Type <span className="text-blue-500 font-mono">→</span> ISL</h3>
                <p className="text-gray-700 text-lg">
                  Enter English text, or use your microphone. Watch our responsive 3D avatar perform the correct Indian Sign Language sequence in real time.
                </p>
                <div className="mt-6 flex items-center gap-2 text-blue-700 font-medium cursor-pointer group">
                  <Link href="/translate" className="flex items-center gap-1 group-hover:underline">
                    Try Translate <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* ISL -> Text */}
            <div className="flex flex-col gap-4 p-8 rounded-3xl bg-gray-900 text-white border border-gray-800 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <span className="material-symbols-outlined text-9xl">photo_camera</span>
              </div>
              <div className="z-10">
                <span className="inline-block px-4 py-1 bg-gray-700 text-white font-bold text-sm rounded-full tracking-wider mb-4 uppercase">
                  Sign to Text
                </span>
                <h3 className="text-2xl font-bold mb-3">Sign <span className="text-blue-400 font-mono">→</span> Text</h3>
                <p className="text-gray-300 text-lg">
                  Use your device camera. Perform an ISL sign, and our live computer vision model will interpret your gestures into written text automatically.
                </p>
                <div className="mt-6 flex items-center gap-2 text-blue-400 font-medium cursor-pointer group">
                  <Link href="/conversation" className="flex items-center gap-1 group-hover:underline">
                    Try Camera <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
      
      {/* Accessibility Footer note */}
      <footer className="py-6 text-center text-gray-500 text-sm border-t border-gray-100 bg-gray-50">
        <p className="flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-base">accessibility_new</span>
          Designed for accessibility. Customize your experience in <Link href="/settings" className="text-blue-600 hover:underline">Settings</Link>.
        </p>
      </footer>
    </div>
  );
}
