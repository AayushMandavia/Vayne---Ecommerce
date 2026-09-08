import { useEffect, useState } from 'react';

interface ShopPreloaderProps {
  onComplete: () => void;
  mode?: 'initial' | 'shop';
}

export default function ShopPreloader({ onComplete, mode = 'shop' }: ShopPreloaderProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = performance.now();
    const duration = 2160; // Exactly 1-time load duration (54 frames / 25 fps = 2.16s)

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

    const timer = setTimeout(() => {
      onComplete();
    }, duration);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-white text-black select-none antialiased"
      style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
    >
      {/* Top Bar */}
      <header className="w-full px-6 sm:px-12 py-6 flex items-center justify-between border-b border-neutral-100">
        <div className="flex items-center gap-3">
          <span
            className="font-bold tracking-[0.25em] text-base sm:text-lg text-black"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            VAYNE
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono tracking-widest text-neutral-500 uppercase">
            {progress}% LOADED
          </span>
        </div>
      </header>

      {/* Centered Lottie Multi-Image Fashion Animation */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 w-full max-w-5xl mx-auto text-center">
        <div className="w-full max-w-2xl sm:max-w-3xl relative flex flex-col items-center justify-center">
          {/* Lottie Embed Player */}
          <div className="w-full aspect-[1366/768] relative overflow-hidden rounded-2xl bg-white">
            <iframe
              src="/preloader-preview.html"
              title="VAYNE Fashion Lookbook Preloader"
              className="w-full h-full border-0 pointer-events-none bg-white"
              allow="autoplay"
            />
          </div>

          {/* Loading status & progress bar */}
          <div className="w-full max-w-xs mt-6 flex flex-col items-center space-y-2.5">
            <div className="w-full h-1 bg-neutral-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-black rounded-full transition-all duration-100 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between w-full text-[11px] font-mono uppercase tracking-[0.18em] text-neutral-400">
              <span>{mode === 'initial' ? 'LAUNCHING SHOWROOM' : 'INITIALIZING STORE'}</span>
              <span>{progress}%</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 sm:py-8 flex flex-col items-center justify-center space-y-1.5 border-t border-neutral-100">
        <div className="flex items-center space-x-2 text-[11px] tracking-[0.2em] uppercase text-neutral-500 font-mono">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
          <span>
            {mode === 'initial'
              ? 'PREPARING VAYNE SHOWCASE'
              : 'PREPARING THE COLLECTION LOOKBOOK'}
          </span>
        </div>
      </footer>
    </div>
  );
}
