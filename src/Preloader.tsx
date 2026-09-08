import { useEffect, useState } from 'react';
import { PRODUCTS } from './data';

interface PreloaderProps {
  onComplete: () => void;
}

const LANDING_IMAGES = [
  '/landing/women-1.png',
  '/landing/women-2.png',
  '/landing/women-3.png',
  '/landing/men-1.png',
  '/landing/men-2.png',
  '/landing/men-3.png',
  '/landing/kid-1.png',
  '/landing/kid-2.png',
  '/landing/kid-3.png',
];

const SHOP_PRELOADER_IMAGES = [
  '/shop-preloader/image_0.png',
  '/shop-preloader/image_1.png',
  '/shop-preloader/image_2.png',
  '/shop-preloader/image_3.png',
  '/shop-preloader/image_4.png',
  '/shop-preloader/image_5.png',
  '/shop-preloader/image_6.png',
  '/shop-preloader/image_7.png',
];

export default function Preloader({ onComplete }: PreloaderProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const minDisplayTime = 4200; // Increased by 2 seconds (was 2.2s -> now 4.2s)
    const startTime = Date.now();

    // Collect landing models, shop preloader lookbook images, and catalog hero images to preload
    const productImages = PRODUCTS.slice(0, 24).map((p) => p.image);
    const allImagesToPreload = Array.from(
      new Set([...LANDING_IMAGES, ...SHOP_PRELOADER_IMAGES, ...productImages])
    );

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

    // Proactively download and decode all landing and shop preloader images into browser cache
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

    // Fallback maximum safety timeout (5.5s max)
    const maxTimer = setTimeout(() => {
      tryFinish();
    }, 5500);

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
