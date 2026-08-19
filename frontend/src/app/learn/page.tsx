'use client';

export default function LearnPage() {
  const dictionary = [
    { sign: 'HELLO', description: 'Wave hand near temple' },
    { sign: 'THANK YOU', description: 'Fingers to chin, move forward' },
    { sign: 'PLEASE', description: 'Flat hand rubbing chest in circle' },
    { sign: 'SORRY', description: 'Fist rubbing chest in circle' },
    { sign: 'YES', description: 'Fist nodding up and down' },
    { sign: 'NO', description: 'Index and middle finger tapping thumb' },
  ];

  return (
    <div className="flex-grow p-4 md:p-8 max-w-4xl mx-auto w-full">
      <h1 className="text-3xl font-bold mb-2">ISL Dictionary</h1>
      <p className="text-gray-600 mb-8">Browse the 30-50 controlled vocabulary signs supported by the MVP.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {dictionary.map((item, idx) => (
          <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3 hover:shadow-md transition-shadow">
            <div className="bg-gray-100 rounded-lg aspect-video flex items-center justify-center text-gray-400">
               <span className="material-symbols-outlined text-4xl">play_circle</span>
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">{item.sign}</h3>
              <p className="text-sm text-gray-500">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-6 bg-blue-50 text-blue-900 rounded-2xl flex items-center gap-4">
        <span className="material-symbols-outlined text-4xl">info</span>
        <p className="text-sm">
          <strong>Note:</strong> The MVP supports a controlled vocabulary of 30-50 words. Full dictionary expansion will occur in Phase 3 after verifying the model accuracy on the custom dataset.
        </p>
      </div>
    </div>
  );
}
