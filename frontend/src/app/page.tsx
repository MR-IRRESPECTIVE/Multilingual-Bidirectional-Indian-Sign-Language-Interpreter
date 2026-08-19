import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex-grow flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-2xl flex flex-col items-center gap-6">
        <div className="bg-blue-100 p-6 rounded-full text-blue-700">
          <span className="material-symbols-outlined text-6xl">waving_hand</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
          Speak. Sign. Understand.
        </h1>
        <p className="text-xl text-gray-600 max-w-lg">
          A bidirectional AI interpreter breaking communication barriers between English/Hindi speakers and the Indian Sign Language community.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto">
          <Link href="/conversation" className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-blue-700 transition-colors shadow-sm">
            <span className="material-symbols-outlined">forum</span>
            Start Conversation
          </Link>
          <Link href="/translate" className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white text-gray-800 border-2 border-gray-200 px-8 py-4 rounded-2xl font-semibold text-lg hover:border-gray-300 hover:bg-gray-50 transition-colors shadow-sm">
            <span className="material-symbols-outlined">translate</span>
            Quick Translate
          </Link>
        </div>
      </div>
    </div>
  );
}
