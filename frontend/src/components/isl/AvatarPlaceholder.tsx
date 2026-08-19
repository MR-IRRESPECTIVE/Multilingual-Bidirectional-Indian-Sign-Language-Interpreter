'use client';

interface AvatarPlaceholderProps {
  activeGloss?: string[];
}

export default function AvatarPlaceholder({ activeGloss }: AvatarPlaceholderProps) {
  const isPlaying = activeGloss && activeGloss.length > 0;
  
  return (
    <div className="bg-white/10 rounded-xl overflow-hidden aspect-[3/4] max-w-[200px] min-w-[150px] relative flex flex-col border border-white/20 shadow-inner">
      {/* 3D Scene Mock */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-transparent flex items-center justify-center">
         <span className={`material-symbols-outlined text-6xl text-blue-200 ${isPlaying ? 'animate-bounce' : 'opacity-50'}`}>
           accessibility_new
         </span>
      </div>
      
      {/* Subtitles Overlay */}
      {isPlaying && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center">
          <div className="bg-black/70 backdrop-blur-sm text-yellow-300 font-mono text-xs font-bold px-3 py-1.5 rounded-lg max-w-[90%] text-center truncate">
            {activeGloss.join(' • ')}
          </div>
        </div>
      )}
      
      {!isPlaying && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center">
           <div className="bg-black/30 text-white/50 text-xs px-2 py-1 rounded">Idle</div>
        </div>
      )}
    </div>
  );
}
