import { useEffect, useState } from 'react';
import { PRODUCTS } from './data';

interface PreloaderProps {
  onComplete: () => void;
}

// ORDER 1: Landing Page Carousel Drops & Category Cards (Crucial for first impression)
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

// ORDER 2: Shop Preloader Lookbook Collage (Crucial for instant shop entry)
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

/**
 * Preloads and decodes an image into browser memory/cache
 */
function preloadSingleImage(src: string, timeoutMs: number = 4000): Promise<void> {
  return new Promise((resolve) => {
    if (!src) {
      resolve();
      return;
    }
    const img = new Image();
    let settled = false;

    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        resolve();
      }
    }, timeoutMs);

    const onFinish = () => {
      if (!settled) {
        settled = true;
        clearTimeout(timer);
        if ('decode' in img && typeof img.decode === 'function') {
          img.decode().catch(() => {}).finally(() => resolve());
        } else {
          resolve();
        }
      }
    };

    img.onload = onFinish;
    img.onerror = () => {
      if (!settled) {
        settled = true;
        clearTimeout(timer);
        resolve();
      }
    };
    img.src = src;
  });
}

/**
 * Preloads a batch of URLs with controlled concurrency
 */
async function preloadBatch(urls: string[], concurrency: number = 6, timeoutMs: number = 4000): Promise<void> {
  const uniqueUrls = Array.from(new Set(urls.filter(Boolean)));
  if (uniqueUrls.length === 0) return;

  let index = 0;
  const worker = async () => {
    while (index < uniqueUrls.length) {
      const currentIndex = index++;
      const url = uniqueUrls[currentIndex];
      await preloadSingleImage(url, timeoutMs);
    }
  };

  const pool = Array.from({ length: Math.min(concurrency, uniqueUrls.length) }, () => worker());
  await Promise.allSettled(pool);
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const minDisplayTime = 4200; // 4.2 seconds minimum luxury display time
    const startTime = Date.now();
    let essentialLoaded = false;

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

    // Sequential Order-wise Preloading Pipeline:
    // 1. Landing -> 2. Shop Preloader -> 3. Catalog Products -> 4. Gallery Images
    const runOrderWisePreload = async () => {
      try {
        // --- ORDER 1: Landing Page Hero Models & Drops ---
        await preloadBatch(LANDING_IMAGES, 9, 3000);

        // --- ORDER 2: Shop Lookbook Transition Photos ---
        await preloadBatch(SHOP_PRELOADER_IMAGES, 8, 3000);

        // First essential tiers are fully loaded and cached in memory
        essentialLoaded = true;
        tryFinish();

        // --- ORDER 3: Entire Product Catalog Primary Card Images (54 items) ---
        const primaryCatalogImages = PRODUCTS.map((p) => p.image);
        await preloadBatch(primaryCatalogImages, 6, 3500);

        // --- ORDER 4: High-Res Alternate Angles, Back Views & Detail Galleries ---
        const primarySet = new Set(primaryCatalogImages);
        const galleryImages = PRODUCTS.flatMap((p) => p.gallery || []).filter((url) => !primarySet.has(url));
        await preloadBatch(galleryImages, 6, 3500);
      } catch (err) {
        console.warn('Preload pipeline caught error:', err);
      } finally {
        if (!essentialLoaded) {
          tryFinish();
        }
      }
    };

    runOrderWisePreload();

    // Fallback maximum safety timeout (6s max)
    const maxTimer = setTimeout(() => {
      tryFinish();
    }, 6000);

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
