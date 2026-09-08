import { useEffect, useState } from 'react';
import { PRODUCTS } from './data';

interface PreloaderProps {
  onComplete: () => void;
}

const CRITICAL_IMAGES = [
  '/landing/women-2.png',
  '/landing/men-1.png',
  '/landing/kid-1.png',
  '/landing/women-1.png',
  '/landing/men-2.png',
  '/landing/kid-2.png',
  '/landing/women-3.png',
  '/landing/men-3.png',
  '/landing/kid-3.png',
];

export default function Preloader({ onComplete }: PreloaderProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const minDisplayTime = 2200; // 2.2s allows at least one full exquisite dot-animation cycle
    const startTime = Date.now();

    // Collect product hero images to cache into memory
    const productImages = PRODUCTS.slice(0, 18).map((p) => p.image);
    const allImagesToPreload = Array.from(new Set([...CRITICAL_IMAGES, ...productImages]));

    let loadedCount = 0;
    const total = allImagesToPreload.length;

    const tryFinish = () => {
      if (!isMounted) return;
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minDisplayTime - elapsed);

      setTimeout(() => {
        if (!isMounted) return;
        setIsExiting(true);
        setTimeout(() => {
          if (isMounted) onComplete();
        }, 550); // Match fade transition duration
      }, remaining);
    };

    if (total === 0) {
      tryFinish();
      return;
    }

    allImagesToPreload.forEach((src) => {
      const img = new Image();
      const onDone = () => {
        loadedCount++;
        if (loadedCount >= total) {
          tryFinish();
        }
      };
      img.onload = onDone;
      img.onerror = onDone;
      img.src = src;
    });

    // Fallback maximum safety timeout (3.5s max)
    const maxTimer = setTimeout(() => {
      tryFinish();
    }, 3500);

    return () => {
      isMounted = false;
      clearTimeout(maxTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col justify-center items-center select-none px-6 py-12 bg-white transition-opacity duration-500 ease-out ${
        isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      {/* Soft Monochrome Ambient Radial Glow */}
      <div className="ambient-glow top-1/2 left-1/2" />

      {/* Center Focal Typography: Luxury Editorial VAYNE with Baseline Dots */}
      <main className="relative z-10 flex flex-col items-center justify-center transition-transform duration-500">
        <div className="flex items-end justify-center tracking-normal text-center">
          <h1 className="font-luxury-editorial text-black select-none brand-hero pl-[0.22em] leading-none">
            VAYNE
          </h1>
          {/* Elegant Crisp Geometric Trailing Dots Sequence (4 dots at bottom baseline) */}
          <div aria-label="Loading" className="dots-container select-none">
            <span className="dot-seq dot-1" />
            <span className="dot-seq dot-2" />
            <span className="dot-seq dot-3" />
            <span className="dot-seq dot-4" />
          </div>
        </div>
      </main>
    </div>
  );
}
