import { useEffect, useState } from 'react';

interface ShopPreloaderProps {
  onComplete: () => void;
  mode?: 'initial' | 'shop';
}

interface LookbookCard {
  id: string;
  src: string;
  title: string;
  left: number; // percentage in 1366 coordinate space
  top: number;  // percentage in 768 coordinate space
  delay: number; // ms when it pops in
  zIndex: number;
}

// Exact layer choreography and spatial positions from the Lottie handoff animation
const CARDS: LookbookCard[] = [
  // Layer 8: Olive Utility Shirt (Men)
  {
    id: 'card-7',
    src: '/shop-preloader/image_7.png',
    title: 'Olive Utility Shirt',
    left: 22.987, // Center: (489, 246)
    top: 9.245,
    delay: 180,
    zIndex: 10,
  },
  // Layer 7: Aero Sky Cargo (Women)
  {
    id: 'card-6',
    src: '/shop-preloader/image_6.png',
    title: 'Aero Sky Cargo',
    left: 1.318, // Center: (193, 294)
    top: 15.495,
    delay: 330,
    zIndex: 11,
  },
  // Layer 6: Botanical Pinafore (Kids)
  {
    id: 'card-5',
    src: '/shop-preloader/image_5.png',
    title: 'Botanical Pinafore',
    left: 11.127, // Center: (327, 549)
    top: 48.698,
    delay: 500,
    zIndex: 12,
  },
  // Layer 5: Sand Linen Atelier (Men)
  {
    id: 'card-4',
    src: '/shop-preloader/image_4.png',
    title: 'Sand Linen Atelier',
    left: 73.133, // Center: (1174, 555)
    top: 49.479,
    delay: 670,
    zIndex: 13,
  },
  // Layer 4: Blush Peplum & Ruffle (Women)
  {
    id: 'card-3',
    src: '/shop-preloader/image_3.png',
    title: 'Blush Peplum & Ruffle',
    left: 47.511, // Center: (824, 213)
    top: 4.948,
    delay: 1000,
    zIndex: 14,
  },
  // Layer 3: Teddy Denim Overalls (Kids)
  {
    id: 'card-2',
    src: '/shop-preloader/image_2.png',
    title: 'Teddy Denim Overalls',
    left: 30.893, // Center: (597, 476)
    top: 39.193,
    delay: 1170,
    zIndex: 15,
  },
  // Layer 2: Shadow Streetwear (Men)
  {
    id: 'card-1',
    src: '/shop-preloader/image_1.png',
    title: 'Shadow Streetwear',
    left: 50.000, // Center: (858, 528)
    top: 45.964,
    delay: 1330,
    zIndex: 16,
  },
  // Layer 1: Crimson Ruched Gown (Women)
  {
    id: 'card-0',
    src: '/shop-preloader/image_0.png',
    title: 'Crimson Ruched Gown',
    left: 69.326, // Center: (1122, 264)
    top: 11.589,
    delay: 1500,
    zIndex: 17,
  },
];

export default function ShopPreloader({ onComplete }: ShopPreloaderProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [visibleIds, setVisibleIds] = useState<Set<string>>(new Set());
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = performance.now();
    const duration = 3000; // 3.0s total: allows all 8 cards to pop in + dwell on completed collage

    // Schedule appearance of each card based on exact delay
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    CARDS.forEach((card) => {
      const t = setTimeout(() => {
        setVisibleIds((prev) => new Set([...prev, card.id]));
      }, card.delay);
      timeouts.push(t);
    });

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

    // Smooth fade out 450ms before completion
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
      timeouts.forEach(clearTimeout);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-between select-none antialiased transition-opacity duration-500 ease-out ${
        isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        backgroundColor: '#ffffff',
        fontFamily: "'Space Grotesk', 'Inter', sans-serif",
      }}
    >
      {/* Top Header */}
      <header className="w-full px-6 sm:px-12 py-5 sm:py-6 flex items-center justify-between border-b border-neutral-100 bg-white z-20">
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
          <span className="text-[11px] font-mono tracking-widest text-neutral-500 uppercase">
            {progress}% LOADED
          </span>
        </div>
      </header>

      {/* Main Full-Bleed Canvas: Choreographed 8-Card Lookbook Collage on Pure White */}
      <main className="flex-1 w-full max-w-7xl mx-auto flex items-center justify-center px-4 sm:px-8 py-2 relative overflow-hidden bg-white">
        <div className="relative w-full aspect-[1366/768] max-h-[78vh] bg-white">
          {CARDS.map((card) => {
            const isVisible = visibleIds.has(card.id);

            return (
              <div
                key={card.id}
                className={`absolute bg-white rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 ease-out ${
                  isVisible
                    ? 'opacity-100 scale-100 translate-y-0 shadow-[0_12px_35px_rgba(0,0,0,0.12)]'
                    : 'opacity-0 scale-90 translate-y-3 pointer-events-none'
                }`}
                style={{
                  left: `${card.left}%`,
                  top: `${card.top}%`,
                  width: '25.622%', // 350 / 1366
                  height: '45.573%', // 350 / 768
                  zIndex: card.zIndex,
                  backgroundColor: '#ffffff',
                  border: '1px solid rgba(0, 0, 0, 0.06)',
                }}
              >
                <img
                  src={card.src}
                  alt={card.title}
                  draggable={false}
                  className="w-full h-full object-contain p-2 sm:p-3 select-none pointer-events-none bg-white"
                />
              </div>
            );
          })}
        </div>
      </main>

      {/* Bottom Footer Progress Bar */}
      <footer className="w-full py-5 sm:py-6 flex flex-col items-center justify-center space-y-2 border-t border-neutral-100 bg-white z-20">
        <div className="w-48 sm:w-64 h-[2px] bg-neutral-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-black rounded-full transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center space-x-2 text-[10px] tracking-[0.22em] uppercase text-neutral-400 font-mono">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
          <span>INITIALIZING STORE LOOKBOOK</span>
        </div>
      </footer>
    </div>
  );
}
