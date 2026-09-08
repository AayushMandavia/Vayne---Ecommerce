import { useEffect, useState } from 'react';

interface ShopPreloaderProps {
  onComplete: () => void;
  mode?: 'initial' | 'shop';
}

export default function ShopPreloader({ onComplete }: ShopPreloaderProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = performance.now();
    const duration = 2800; // 2.8s: allows full animation cycle + pause on completed collage

    let frameId: number;
    const updateProgress = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (elapsed < duration) {
        frameId = requestAnimationFrame(updateProgress);
      }
    };

    frameId = requestAnimationFrame(updateProgress);

    // Trigger smooth fade out 450ms before completion
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, duration - 450);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, duration);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white text-black select-none antialiased transition-opacity duration-500 ease-out ${
        isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        backgroundColor: '#ffffff',
        fontFamily: "'Space Grotesk', 'Inter', sans-serif",
      }}
    >
      {/* Top Subtle Luxury Indicator */}
      <header className="absolute top-0 inset-x-0 w-full px-6 sm:px-12 py-6 flex items-center justify-between pointer-events-none z-10">
        <div className="flex items-center gap-3">
          <span
            className="font-bold tracking-[0.25em] text-sm sm:text-base text-black uppercase"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            VAYNE
          </span>
          <span className="text-neutral-300 hidden sm:inline">/</span>
          <span className="text-[10px] sm:text-xs font-mono tracking-[0.2em] text-neutral-400 uppercase hidden sm:inline">
            LOOKBOOK SHOWCASE
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono tracking-widest text-neutral-400 uppercase">
            {progress}%
          </span>
        </div>
      </header>

      {/* Main Full-Screen Lottie Animation with User Store Images on White Background */}
      <main className="w-full h-full flex items-center justify-center p-2 sm:p-6 md:p-8 bg-white">
        <div className="w-full h-full max-w-[1366px] max-h-[768px] relative flex items-center justify-center bg-white">
          <iframe
            src="/preloader-preview.html"
            title="VAYNE Fashion Lookbook Preloader"
            className="w-full h-full border-0 pointer-events-none bg-white"
            style={{ backgroundColor: '#ffffff' }}
            allow="autoplay"
          />
        </div>
      </main>

      {/* Bottom Subtle Status Bar */}
      <footer className="absolute bottom-0 inset-x-0 w-full py-6 flex flex-col items-center justify-center space-y-2 pointer-events-none z-10 bg-white">
        <div className="w-48 sm:w-64 h-[2px] bg-neutral-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-black rounded-full transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center space-x-2 text-[10px] tracking-[0.22em] uppercase text-neutral-400 font-mono">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
          <span>ENTERING THE COLLECTION</span>
        </div>
      </footer>
    </div>
  );
}
