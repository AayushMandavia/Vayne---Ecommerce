import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Shuffle, ShoppingBag, User } from 'lucide-react';
import CollectionCatalog from './CollectionCatalog';
import ProductDetail from './ProductDetail';
import CartDrawer, { type CartItem, type RecommendedProduct } from './CartDrawer';
import Checkout from './Checkout';
import Preloader from './Preloader';
import ShopPreloader from './ShopPreloader';
import AccountModal from './AccountModal';
import { SilhouetteMen, SilhouetteWomen, SilhouetteKids } from './CategorySilhouettes';
import { type CategoryId, type Product } from './data';

interface Drop {
  src: string;
  bg: string;
  title: string;
  subtitle?: string;
  category?: string;
  copy: string;
}

const DROPS: Drop[] = [
  {
    src: '/landing/women-2.png',
    bg: '#F46554',
    title: 'DROP 01',
    subtitle: 'CRIMSON RUCHED GOWN',
    category: 'WOMEN',
    copy: 'Sculptural off-shoulder asymmetric ruched evening maxi crafted in rich ruby modal.',
  },
  {
    src: '/landing/men-1.png',
    bg: '#2C2E35',
    title: 'DROP 02',
    subtitle: 'SHADOW STREETWEAR',
    category: 'MEN',
    copy: 'The statement begins here. Heavyweight boxy zip-hoodie and architectural wide cargo trousers in pitch black.',
  },
  {
    src: '/landing/kid-1.png',
    bg: '#50A0FF',
    title: 'DROP 03',
    subtitle: 'TEDDY DENIM OVERALLS',
    category: 'KIDS',
    copy: 'Classic washed denim dungarees with bear embroidery patch and nautical stripe underlayer.',
  },
  {
    src: '/landing/women-1.png',
    bg: '#FD9CA1',
    title: 'DROP 04',
    subtitle: 'BLUSH PEPLUM & RUFFLE',
    category: 'WOMEN',
    copy: 'Soft layers, strong proportions. Off-shoulder ribbed knit top with tiered white flounce ruffle skirt.',
  },
  {
    src: '/landing/men-2.png',
    bg: '#DFCAA0',
    title: 'DROP 05',
    subtitle: 'SAND LINEN ATELIER',
    category: 'MEN',
    copy: 'Everyday essentials with an oversized fit and tailored fluid linen drape in desert sand.',
  },
  {
    src: '/landing/kid-2.png',
    bg: '#FD9CA1',
    title: 'DROP 06',
    subtitle: 'BOTANICAL PINAFORE',
    category: 'KIDS',
    copy: 'Dusty rose ribbed corduroy dress with floral hand-embroidery over an ivory Peter Pan blouse.',
  },
  {
    src: '/landing/women-3.png',
    bg: '#50A5EF',
    title: 'DROP 07',
    subtitle: 'AERO SKY CARGO',
    category: 'WOMEN',
    copy: 'Cropped technical wind jacket and relaxed parachute trousers tailored in fluid powder sky blue.',
  },
  {
    src: '/landing/men-3.png',
    bg: '#40B165',
    title: 'DROP 08',
    subtitle: 'OLIVE UTILITY SHIRT',
    category: 'MEN',
    copy: 'Garment-dyed military field overshirt layered over relaxed washed dark denim.',
  },
  {
    src: '/landing/kid-3.png',
    bg: '#DFCAA0',
    title: 'DROP 09',
    subtitle: 'OATMEAL SHERPA ONESIE',
    category: 'KIDS',
    copy: 'Ultra-soft bonded teddy sherpa hooded jumpsuit with novelty sculpted bear ears.',
  },
];

const CATEGORIES = [
  {
    id: 'men',
    name: 'MEN',
    image: '/landing/men-1.png',
    tagline: 'Oversized silhouettes, heavy tailoring & modern streetwear.',
    count: '24 PIECES',
  },
  {
    id: 'women',
    name: 'WOMEN',
    image: '/landing/women-1.png',
    tagline: 'Sculptural cuts, fluid layers & bold statement essentials.',
    count: '32 PIECES',
  },
  {
    id: 'kids',
    name: 'KIDS',
    image: '/landing/kid-3.png',
    tagline: 'Refined miniature proportions with premium comfort.',
    count: '18 PIECES',
  },
];

const GRAIN_DATA_URI = `data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E`;

const INITIAL_CART: CartItem[] = [];

type Role = 'center' | 'left' | 'right' | 'back';
type ShopFlowState = 'idle' | 'category-select' | 'catalog' | 'pdp' | 'checkout';

export default function App() {
  const [initialIndex] = useState(() => Math.floor(Math.random() * DROPS.length));
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [textIndex, setTextIndex] = useState(initialIndex);
  const [isAnimating, setIsAnimating] = useState(false);
  const [swapping, setSwapping] = useState(false);
  const [isMobile, setIsMobile] = useState(() => (typeof window !== 'undefined' ? window.innerWidth < 640 : false));
  const [shopFlow, setShopFlow] = useState<ShopFlowState>('idle');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>(INITIAL_CART);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [showInitialPreloader, setShowInitialPreloader] = useState(true);
  const [showShopPreloader, setShowShopPreloader] = useState(false);
  const [showShoppingGuide, setShowShoppingGuide] = useState(false);

  // Show "Start Shopping" curly arrow guide 2.5s after landing page appears (after preloader finishes)
  useEffect(() => {
    if (!showInitialPreloader && shopFlow === 'idle') {
      const timer = setTimeout(() => {
        setShowShoppingGuide(true);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [showInitialPreloader, shopFlow]);

  // Auto-rotate mode (engages within 1s after user stops scrolling, then cycles every 5s)
  const lastActivityTime = useRef(Date.now());
  const hasAutoRotatedAfterScroll = useRef(false);
  const isUserInteracting = useRef(false);
  const lastPointerPos = useRef({ x: 0, y: 0 });

  // Scroll & swipe/drag gesture tracking on landing page
  const lastScrollTime = useRef(0);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchStartTime = useRef(0);
  const isPointerDown = useRef(false);
  const pointerStartX = useRef(0);
  const pointerStartTime = useRef(0);

  const handleAddToCart = (product: Product, size: string, color: string) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === product.id && item.size === size && item.color === color
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      const newItem: CartItem = {
        id: `cart-${Date.now()}-${product.id}`,
        productId: product.id,
        name: product.name,
        price: product.price,
        priceNum: product.priceNum,
        image: product.image,
        color,
        size,
        quantity: 1,
      };
      return [newItem, ...prev];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddRecommended = (rec: RecommendedProduct) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.productId === rec.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      const newItem: CartItem = {
        id: `cart-${Date.now()}-${rec.id}`,
        productId: rec.id,
        name: rec.name,
        price: rec.price,
        priceNum: rec.priceNum,
        image: rec.image,
        color: rec.color || 'Standard',
        size: rec.size || 'OS',
        quantity: 1,
      };
      return [newItem, ...prev];
    });
  };

  // Preload all images on mount
  useEffect(() => {
    DROPS.forEach((drop) => {
      const img = new Image();
      img.src = drop.src;
    });
  }, []);

  // Track viewport width for responsive calculations
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Navigation handler
  const navigate = useCallback((direction: 'next' | 'prev') => {
    if (isAnimating) return;

    lastActivityTime.current = Date.now();
    setIsAnimating(true);
    const total = DROPS.length;
    const nextIdx = direction === 'next' ? (activeIndex + 1) % total : (activeIndex + total - 1) % total;
    setActiveIndex(nextIdx);

    // Cross-fade drop title + description text
    setSwapping(true);
    setTimeout(() => {
      setTextIndex(nextIdx);
      setSwapping(false);
    }, 200);

    // Unlock animation after 650ms
    setTimeout(() => {
      setIsAnimating(false);
    }, 650);
  }, [activeIndex, isAnimating]);

  const jumpToIndex = useCallback((targetIdx: number) => {
    if (isAnimating || targetIdx === activeIndex) return;

    lastActivityTime.current = Date.now();
    hasAutoRotatedAfterScroll.current = false;
    setIsAnimating(true);
    setActiveIndex(targetIdx);

    setSwapping(true);
    setTimeout(() => {
      setTextIndex(targetIdx);
      setSwapping(false);
    }, 200);

    setTimeout(() => {
      setIsAnimating(false);
    }, 650);
  }, [activeIndex, isAnimating]);

  const handleRandom = useCallback(() => {
    if (isAnimating) return;

    lastActivityTime.current = Date.now();
    hasAutoRotatedAfterScroll.current = false;
    setIsAnimating(true);
    let nextIdx = Math.floor(Math.random() * DROPS.length);
    while (nextIdx === activeIndex && DROPS.length > 1) {
      nextIdx = Math.floor(Math.random() * DROPS.length);
    }
    setActiveIndex(nextIdx);

    setSwapping(true);
    setTimeout(() => {
      setTextIndex(nextIdx);
      setSwapping(false);
    }, 200);

    setTimeout(() => {
      setIsAnimating(false);
    }, 650);
  }, [activeIndex, isAnimating]);

  const navigateRef = useRef(navigate);
  useEffect(() => {
    navigateRef.current = navigate;
  }, [navigate]);

  // Auto-rotate mode effect: within 1s after user stops scrolling, it engages auto mode and cycles every 5s
  useEffect(() => {
    if (
      shopFlow !== 'idle' ||
      showInitialPreloader ||
      showShopPreloader ||
      isCartOpen ||
      isAccountOpen
    ) {
      return;
    }

    // Reset inactivity timer and auto-mode flag when entering landing page / when preloader completes
    lastActivityTime.current = Date.now();
    hasAutoRotatedAfterScroll.current = false;

    const handleUserScrollOrInteraction = () => {
      lastActivityTime.current = Date.now();
      hasAutoRotatedAfterScroll.current = false;
    };

    const handleTouchStart = () => {
      isUserInteracting.current = true;
      lastActivityTime.current = Date.now();
      hasAutoRotatedAfterScroll.current = false;
    };

    const handleTouchEnd = () => {
      isUserInteracting.current = false;
      lastActivityTime.current = Date.now();
      hasAutoRotatedAfterScroll.current = false;
    };

    const handlePointerDown = () => {
      isUserInteracting.current = true;
      lastActivityTime.current = Date.now();
      hasAutoRotatedAfterScroll.current = false;
    };

    const handlePointerUp = () => {
      isUserInteracting.current = false;
      lastActivityTime.current = Date.now();
      hasAutoRotatedAfterScroll.current = false;
    };

    const handlePointerMove = (e: PointerEvent) => {
      const dx = Math.abs(e.clientX - lastPointerPos.current.x);
      const dy = Math.abs(e.clientY - lastPointerPos.current.y);
      if (dx > 8 || dy > 8) {
        lastPointerPos.current = { x: e.clientX, y: e.clientY };
        lastActivityTime.current = Date.now();
        hasAutoRotatedAfterScroll.current = false;
      }
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        lastActivityTime.current = Date.now();
        hasAutoRotatedAfterScroll.current = false;
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleUserScrollOrInteraction, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('wheel', handleUserScrollOrInteraction, { passive: true });
    window.addEventListener('keydown', handleUserScrollOrInteraction, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const interval = setInterval(() => {
      if (document.hidden) return;
      if (isUserInteracting.current || isPointerDown.current) return;

      const idleDuration = Date.now() - lastActivityTime.current;
      // Within 1 second (1000ms) after user stops scrolling: auto mode activates!
      // Once in auto mode: rotates every 5 seconds (5000ms)!
      const requiredDelay = hasAutoRotatedAfterScroll.current ? 5000 : 1000;

      if (idleDuration >= requiredDelay) {
        hasAutoRotatedAfterScroll.current = true;
        lastActivityTime.current = Date.now();
        navigateRef.current('next');
      }
    }, 100);

    return () => {
      clearInterval(interval);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleUserScrollOrInteraction);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('wheel', handleUserScrollOrInteraction);
      window.removeEventListener('keydown', handleUserScrollOrInteraction);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [
    shopFlow,
    showInitialPreloader,
    showShopPreloader,
    isCartOpen,
    isAccountOpen,
  ]);

  // Keyboard navigation (ArrowLeft / ArrowRight only when in showcase landing page)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (shopFlow === 'idle') {
        if (e.key === 'ArrowRight') {
          navigate('next');
        } else if (e.key === 'ArrowLeft') {
          navigate('prev');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, shopFlow]);

  // Scroll wheel & touch swipe navigation on home landing page
  useEffect(() => {
    if (shopFlow !== 'idle') return;

    const handleWheel = (e: WheelEvent) => {
      // Prevent browser default bounce/scroll on landing page
      e.preventDefault();

      const now = Date.now();
      if (now - lastScrollTime.current < 700) return;

      const threshold = 25;
      if (Math.abs(e.deltaY) > threshold || Math.abs(e.deltaX) > threshold) {
        if (e.deltaY > threshold || e.deltaX > threshold) {
          lastScrollTime.current = now;
          navigate('next');
        } else if (e.deltaY < -threshold || e.deltaX < -threshold) {
          lastScrollTime.current = now;
          navigate('prev');
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
      touchStartTime.current = Date.now();
    };

    const handleTouchMove = (e: TouchEvent) => {
      // Prevent browser default pull-to-refresh or page navigation on landing page
      if (e.cancelable) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!e.changedTouches || e.changedTouches.length === 0) return;
      const diffX = touchStartX.current - e.changedTouches[0].clientX;
      const diffY = touchStartY.current - e.changedTouches[0].clientY;
      const duration = Date.now() - touchStartTime.current;
      const now = Date.now();
      if (now - lastScrollTime.current < 650) return;

      // Fast flick or standard swipe threshold
      const threshold = duration < 350 ? 25 : 45;
      if (Math.abs(diffX) > threshold || Math.abs(diffY) > threshold) {
        if (Math.abs(diffX) >= Math.abs(diffY)) {
          // Horizontal swipe takes primary precedence
          if (diffX > threshold) {
            // Swiped Left -> next model
            lastScrollTime.current = now;
            navigate('next');
          } else if (diffX < -threshold) {
            // Swiped Right -> prev model
            lastScrollTime.current = now;
            navigate('prev');
          }
        } else {
          // Vertical swipe
          if (diffY > threshold) {
            // Swiped Up -> next model
            lastScrollTime.current = now;
            navigate('next');
          } else if (diffY < -threshold) {
            // Swiped Down -> prev model
            lastScrollTime.current = now;
            navigate('prev');
          }
        }
      }
    };

    // Desktop pointer drag support
    const handlePointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      isPointerDown.current = true;
      pointerStartX.current = e.clientX;
      pointerStartTime.current = Date.now();
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (!isPointerDown.current) return;
      isPointerDown.current = false;
      const diffX = pointerStartX.current - e.clientX;
      const duration = Date.now() - pointerStartTime.current;
      const now = Date.now();
      if (now - lastScrollTime.current < 650) return;

      const threshold = duration < 350 ? 30 : 60;
      if (Math.abs(diffX) > threshold) {
        if (diffX > threshold) {
          lastScrollTime.current = now;
          navigate('next');
        } else if (diffX < -threshold) {
          lastScrollTime.current = now;
          navigate('prev');
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [navigate, shopFlow]);

  // Trigger shop flow: mount category page immediately underneath and show lookbook preloader
  const handleOpenShop = () => {
    setSelectedCategory(null);
    setShopFlow('category-select');
    setShowShopPreloader(true);
  };

  const handleShopPreloaderComplete = () => {
    setShowShopPreloader(false);
  };

  // Derive role for each model index
  const getRole = useCallback((index: number): Role => {
    const total = DROPS.length;
    if (index === activeIndex) return 'center';
    if (index === (activeIndex + total - 1) % total) return 'left';
    if (index === (activeIndex + 1) % total) return 'right';
    return 'back';
  }, [activeIndex]);

  // Compute style based on role and screen size
  const getRoleStyle = useCallback((role: Role): React.CSSProperties => {
    const baseTransition = 'transform 650ms cubic-bezier(0.4, 0, 0.2, 1), filter 650ms cubic-bezier(0.4, 0, 0.2, 1), opacity 650ms cubic-bezier(0.4, 0, 0.2, 1), left 650ms cubic-bezier(0.4, 0, 0.2, 1), height 650ms cubic-bezier(0.4, 0, 0.2, 1), bottom 650ms cubic-bezier(0.4, 0, 0.2, 1)';

    switch (role) {
      case 'center':
        return {
          position: 'absolute',
          aspectRatio: '0.6 / 1',
          transform: 'translateX(-50%)',
          filter: 'blur(0px)',
          opacity: 1,
          zIndex: 20,
          left: '50%',
          height: isMobile ? '68%' : '93%',
          bottom: isMobile ? '16%' : '0',
          transition: baseTransition,
          willChange: 'transform, filter, opacity',
          pointerEvents: 'none',
        };
      case 'left':
        return {
          position: 'absolute',
          aspectRatio: '0.6 / 1',
          transform: 'translateX(-50%)',
          filter: 'blur(2px)',
          opacity: isMobile ? 0.35 : 0.75,
          zIndex: 10,
          left: isMobile ? '8%' : '18%',
          height: isMobile ? '15%' : '26%',
          bottom: isMobile ? '38%' : '28%',
          transition: baseTransition,
          willChange: 'transform, filter, opacity',
          pointerEvents: 'none',
        };
      case 'right':
        return {
          position: 'absolute',
          aspectRatio: '0.6 / 1',
          transform: 'translateX(-50%)',
          filter: 'blur(2px)',
          opacity: isMobile ? 0.35 : 0.75,
          zIndex: 10,
          left: isMobile ? '92%' : '82%',
          height: isMobile ? '15%' : '26%',
          bottom: isMobile ? '38%' : '28%',
          transition: baseTransition,
          willChange: 'transform, filter, opacity',
          pointerEvents: 'none',
        };
      case 'back':
        return {
          position: 'absolute',
          aspectRatio: '0.6 / 1',
          transform: 'translateX(-50%) scale(0.8)',
          filter: 'blur(4px)',
          opacity: 0,
          zIndex: 5,
          left: '50%',
          height: isMobile ? '12%' : '20%',
          bottom: isMobile ? '38%' : '28%',
          transition: baseTransition,
          willChange: 'transform, filter, opacity',
          pointerEvents: 'none',
        };
    }
  }, [isMobile]);

  const activeBg = useMemo(() => DROPS[activeIndex].bg, [activeIndex]);
  const currentDrop = DROPS[textIndex];

  return (
    <div
      className={`relative w-full overflow-hidden select-none ${
        shopFlow === 'idle' ? 'touch-none' : ''
      }`}
      style={{
        backgroundColor: activeBg,
        transition: 'background-color 650ms cubic-bezier(0.4, 0, 0.2, 1)',
        fontFamily: "'Inter', sans-serif",
        touchAction: shopFlow === 'idle' ? 'none' : 'auto',
        overscrollBehavior: 'none',
      }}
    >
      <div className="relative w-full h-[100dvh] min-h-[100dvh] sm:h-screen overflow-hidden">
        {/* 0. Mobile Top Header (Clean Minimalist Luxury Anchor, hidden on desktop) */}
        <header className="sm:hidden absolute top-0 inset-x-0 z-40 px-5 pt-4 pb-2 flex items-center justify-between text-white pointer-events-auto">
          <div className="flex items-center gap-2">
            <span
              className="font-bold tracking-[0.22em] text-sm uppercase text-white"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              VAYNE
            </span>
            <span className="text-white/40 text-[10px] font-mono tracking-widest uppercase">/ 2026</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-white hover:opacity-80 transition-opacity cursor-pointer"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-5 h-5 text-white" strokeWidth={1.8} />
              {cartItems.reduce((acc, i) => acc + i.quantity, 0) > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-white text-black text-[10px] font-bold flex items-center justify-center rounded-full shadow-sm">
                  {cartItems.reduce((acc, i) => acc + i.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* 1. Grain overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 50,
            opacity: 0.4,
            backgroundImage: `url("${GRAIN_DATA_URI}")`,
            backgroundSize: '200px 200px',
            backgroundRepeat: 'repeat',
          }}
        />

        {/* 2. Giant hero brand typography: VAYNE behind the model */}
        <div
          className="absolute inset-x-0 flex items-center justify-center pointer-events-none select-none"
          style={{
            zIndex: 2,
            top: isMobile ? '8%' : '9%',
            fontFamily: "'Anton', sans-serif",
            fontSize: 'clamp(80px, min(25vw, 40vh), 360px)',
            fontWeight: 400,
            color: '#FFFFFF',
            opacity: 1,
            lineHeight: 1,
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            whiteSpace: 'nowrap',
          }}
        >
          VAYNE
        </div>

        {/* 3. Carousel (Models / Drops) */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 3 }}>
          {DROPS.map((drop, index) => {
            const role = getRole(index);
            const style = getRoleStyle(role);

            return (
              <div key={drop.src} style={style}>
                <img
                  src={drop.src}
                  alt="VAYNE Model"
                  draggable={false}
                  className="w-full h-full object-contain pointer-events-none drop-shadow-[0_18px_30px_rgba(0,0,0,0.18)]"
                  style={{
                    objectPosition: 'bottom center',
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* 4. Bottom controls */}
        <div
          className="absolute bottom-5 left-4 right-4 sm:right-auto sm:bottom-8 sm:left-8 md:bottom-10 md:left-12 lg:left-16"
          style={{
            zIndex: 60,
            maxWidth: isMobile ? 'none' : '380px',
          }}
        >
          {/* Category Pill & Counter */}
          <div
            className="flex items-center gap-2.5 mb-1.5 sm:mb-2.5"
            style={{
              opacity: swapping ? 0 : 1,
              transition: 'opacity 200ms ease',
            }}
          >
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] font-semibold px-2 sm:px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-white">
              {currentDrop.category || 'COLLECTION'}
            </span>
            <span className="text-[11px] sm:text-xs font-mono tracking-widest text-white/80">
              {String(textIndex + 1).padStart(2, '0')} / {String(DROPS.length).padStart(2, '0')}
            </span>
          </div>

          {/* Drop Title + Subtitle */}
          <div
            className="mb-2 sm:mb-3"
            style={{
              opacity: swapping ? 0 : 0.95,
              transition: 'opacity 200ms ease',
            }}
          >
            <p
              className="uppercase font-bold text-base sm:text-[24px] text-white leading-tight"
              style={{
                letterSpacing: '0.02em',
              }}
            >
              {currentDrop.title}
              {currentDrop.subtitle && (
                <span className="font-normal text-xs sm:text-sm text-white/85 ml-1.5 sm:ml-2 inline">
                  • {currentDrop.subtitle}
                </span>
              )}
            </p>
          </div>

          {/* Drop Description (Desktop only) */}
          <p
            className="hidden sm:block text-xs sm:text-sm text-white mb-3 sm:mb-4"
            style={{
              opacity: swapping ? 0 : 0.85,
              lineHeight: 1.6,
              transition: 'opacity 200ms ease',
            }}
          >
            {currentDrop.copy}
          </p>

          {/* Drop Indicator Pills */}
          <div className="flex items-center gap-1.5 mb-3 sm:mb-4">
            {DROPS.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => jumpToIndex(idx)}
                aria-label={`Go to drop ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer border-0 p-0 ${
                  idx === activeIndex
                    ? 'w-5 sm:w-6 bg-white'
                    : 'w-1.5 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>

          {/* Action Row: Nav Buttons & Mobile Inline SHOP CTA */}
          <div className="flex items-center justify-between gap-3 sm:justify-start">
            <div className="flex items-center gap-2 sm:gap-3.5">
              <button
                type="button"
                onClick={() => navigate('prev')}
                aria-label="Previous drop"
                className="w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center border-2 border-white text-white cursor-pointer transition-all duration-150 ease-out hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: 'transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.transform = 'scale(1.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <ArrowLeft className="w-4 h-4 sm:w-6 sm:h-6" strokeWidth={2.25} />
              </button>

              <button
                type="button"
                onClick={handleRandom}
                aria-label="Random drop"
                title="Random drop"
                className="w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center border-2 border-white/80 text-white cursor-pointer transition-all duration-150 ease-out hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: 'transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.transform = 'scale(1.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <Shuffle className="w-3.5 h-3.5 sm:w-5 sm:h-5" strokeWidth={2.25} />
              </button>

              <button
                type="button"
                onClick={() => navigate('next')}
                aria-label="Next drop"
                className="w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center border-2 border-white text-white cursor-pointer transition-all duration-150 ease-out hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: 'transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.transform = 'scale(1.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <ArrowRight className="w-4 h-4 sm:w-6 sm:h-6" strokeWidth={2.25} />
              </button>
            </div>

            {/* Mobile-Only Integrated SHOP Button */}
            <div className="sm:hidden">
              <button
                type="button"
                onClick={handleOpenShop}
                className="group flex items-center gap-2 text-white no-underline select-none cursor-pointer border-2 border-white rounded-full px-4 py-2 bg-transparent backdrop-blur-sm transition-all duration-200 ease-out hover:bg-white hover:text-black active:scale-95 shadow-sm"
                style={{
                  fontFamily: "'Anton', sans-serif",
                  fontSize: '20px',
                  fontWeight: 400,
                  letterSpacing: '-0.01em',
                  lineHeight: 1,
                  textTransform: 'uppercase',
                }}
              >
                <span>SHOP</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2.25} />
              </button>
            </div>
          </div>
        </div>

        {/* 5. Desktop-only Bottom-right CTA "SHOP →" (Keeps desktop 100% untouched) */}
        <div
          className="hidden sm:block absolute sm:bottom-8 sm:right-8 md:bottom-10 md:right-12 lg:right-16"
          style={{ zIndex: 60 }}
        >
          <button
            type="button"
            onClick={handleOpenShop}
            className="group flex items-center gap-2.5 sm:gap-3.5 text-white no-underline select-none cursor-pointer border-2 border-white rounded-full px-5 py-2 sm:px-7 sm:py-3 md:px-8 md:py-3.5 bg-transparent backdrop-blur-sm transition-all duration-200 ease-out hover:bg-white hover:text-black hover:scale-105 active:scale-95 shadow-sm"
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: 'clamp(20px, 3.2vw, 40px)',
              fontWeight: 400,
              letterSpacing: '-0.01em',
              lineHeight: 1,
              textTransform: 'uppercase',
            }}
          >
            <span>SHOP</span>
            <ArrowRight className="w-5 h-5 sm:w-7 sm:h-7 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2.25} />
          </button>
        </div>

        {/* 5b. Hand-Drawn "Start Shopping" Arrow Guide (Purely visual indicator, points down into SHOP button) */}
        {showShoppingGuide && shopFlow === 'idle' && (
          <div
            className="absolute z-[65] pointer-events-none select-none transition-all animate-guide-enter"
            style={{
              bottom: isMobile ? '106px' : 'clamp(125px, 18vh, 165px)',
              right: isMobile ? '16px' : 'clamp(32px, 5.2vw, 84px)',
            }}
          >
            <div className="animate-guide-float flex flex-col items-center select-none">
              {/* Text: Start Shopping (Visual indicator only) */}
              <span
                className="text-white text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)] whitespace-nowrap"
                style={{
                  fontFamily: "'Caveat', cursive",
                  lineHeight: 1,
                  display: 'inline-block',
                  transform: 'rotate(-2deg)',
                }}
              >
                Start Shopping
              </span>

              {/* Hand-Drawn Solid White Curly Loop Arrow - perfectly aligned pointer */}
              <svg
                className="w-16 h-20 sm:w-20 sm:h-24 md:w-24 md:h-28 text-white drop-shadow-[0_3px_10px_rgba(0,0,0,0.6)] mt-1"
                viewBox="0 0 100 140"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Curly loop stem - smoothly enters straight down along central axis */}
                <path
                  d="M 58 8 C 68 24, 70 42, 60 56 C 50 70, 42 56, 44 42 C 46 28, 62 26, 68 42 C 74 58, 64 76, 56 94 C 48 108, 45 115, 45 124"
                  stroke="white"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Symmetrical hand-drawn arrowhead pointing straight down */}
                <path
                  d="M 32 108 L 45 124 L 58 108"
                  stroke="white"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        )}


        {/* ========================================================================= */}
        {/* 6. CATEGORY SELECTION (Stitch Editorial Redesign: MEN, WOMEN, KIDS)       */}
        {/* ========================================================================= */}
        {shopFlow === 'category-select' && (
          <div
            className="fixed inset-0 z-[100] flex flex-col bg-white text-black min-h-screen font-sans selection:bg-black selection:text-white antialiased overflow-y-auto"
            style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
          >
            {/* Top Bar with Navigation Back to Lookbook + Cart & Account Access */}
            <header className="w-full border-b border-neutral-200 sticky top-0 bg-white/95 backdrop-blur-sm z-50 px-4 sm:px-12 py-3 sm:py-5 flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setShopFlow('idle')}
                  className="flex items-center gap-1.5 text-black hover:opacity-75 transition-opacity cursor-pointer mr-1 sm:mr-3 py-1 px-2 -ml-1.5 rounded hover:bg-black/5"
                  title="Return to Lookbook"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-[11px] sm:text-xs font-mono uppercase tracking-wider">LOOKBOOK</span>
                </button>
                <span className="font-bold tracking-[0.2em] text-sm sm:text-base text-black hidden xs:inline">
                  VAYNE
                </span>
                <span className="text-neutral-300 hidden sm:inline">/</span>
                <span className="text-xs uppercase tracking-[0.16em] text-neutral-500 font-mono hidden sm:inline">
                  SELECT DEPARTMENT
                </span>
              </div>

              <div className="flex items-center gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={() => setIsAccountOpen(true)}
                  className="p-1 text-black hover:opacity-70 transition-opacity cursor-pointer"
                  aria-label="Account"
                >
                  <User className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.75} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(true)}
                  className="relative cursor-pointer p-1 text-black hover:opacity-70 transition-opacity"
                  aria-label="Shopping Bag"
                >
                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-black" strokeWidth={1.75} />
                  {cartItems.reduce((acc, i) => acc + i.quantity, 0) > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                      {cartItems.reduce((acc, i) => acc + i.quantity, 0)}
                    </span>
                  )}
                </button>
              </div>
            </header>

            {/* Editorial Content */}
            <main className="flex-grow flex flex-col justify-start sm:justify-between max-w-7xl mx-auto w-full px-5 sm:px-6 md:px-12 pt-5 sm:pt-12 md:pt-16 pb-8 sm:pb-20">
              {/* Hero Title */}
              <section className="mb-6 sm:mb-12 md:mb-16">
                <h1
                  className="text-3xl sm:text-7xl lg:text-8xl tracking-tight text-black uppercase"
                  style={{
                    fontFamily: "'Anton', sans-serif",
                    letterSpacing: '-0.015em',
                    lineHeight: 0.88,
                  }}
                >
                  CHOOSE YOUR COLLECTION
                </h1>
              </section>

              {/* Full-width Stacked Editorial List with Divider Hairlines */}
              <section
                aria-label="Departments Collection"
                className="border-t border-black divide-y divide-neutral-200"
              >
                {CATEGORIES.map((category) => {
                  const isSelected = selectedCategory === category.id;

                  return (
                    <article
                      key={category.id}
                      onClick={() => {
                        setSelectedCategory(category.id as CategoryId);
                        setShopFlow('catalog');
                      }}
                      className={`group py-6 sm:py-10 md:py-14 px-1 sm:px-4 block cursor-pointer transition-all duration-300 ${
                        isSelected ? 'bg-neutral-50' : 'hover:bg-black/[0.015]'
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-6">
                        {/* Department Title & Silhouette (Matches Editorial Signage) */}
                        <div className="flex items-center gap-4 sm:gap-8 lg:gap-10 transition-transform duration-300 ease-out group-hover:translate-x-3 sm:group-hover:translate-x-4">
                          <div className="shrink-0 flex items-center justify-center">
                            {category.id === 'men' && <SilhouetteMen />}
                            {category.id === 'women' && <SilhouetteWomen />}
                            {category.id === 'kids' && <SilhouetteKids />}
                          </div>

                          <h2
                            className="text-4xl sm:text-8xl lg:text-9xl text-black"
                            style={{
                              fontFamily: "'Anton', sans-serif",
                              letterSpacing: '-0.015em',
                              lineHeight: 0.88,
                              textTransform: 'uppercase',
                            }}
                          >
                            {category.name}
                          </h2>
                        </div>

                        {/* Metadata & Interactive Arrow */}
                        <div className="flex items-center justify-between lg:justify-end gap-4 sm:gap-14 lg:w-1/2">
                          <div className="max-w-xs sm:max-w-sm">
                            <p className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-neutral-500 mb-0.5 sm:mb-1.5 font-medium">
                              {category.count}
                            </p>
                            <p className="text-xs sm:text-sm md:text-base text-neutral-800 leading-snug sm:leading-relaxed font-normal">
                              {category.tagline}
                            </p>
                          </div>

                          <div
                            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border transition-all duration-300 ease-out flex items-center justify-center shrink-0 self-center ${
                              isSelected
                                ? 'bg-black text-white border-black translate-x-1.5 -translate-y-1.5 shadow-md'
                                : 'border-neutral-300 text-neutral-700 group-hover:bg-black group-hover:text-white group-hover:border-black group-hover:translate-x-1.5 group-hover:-translate-y-1.5'
                            }`}
                          >
                            <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200" strokeWidth={2} />
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </section>

              {/* Selection Feedback */}
              {selectedCategory && (
                <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-6 rounded-2xl bg-black text-white animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div>
                    <p className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-1">
                      DEPARTMENT SELECTED
                    </p>
                    <p className="text-sm sm:text-base text-white font-medium">
                      Ready to explore the{' '}
                      <span className="font-bold tracking-wider underline underline-offset-4">
                        {CATEGORIES.find((c) => c.id === selectedCategory)?.name}
                      </span>{' '}
                      lookbook & pieces.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShopFlow('catalog')}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white text-black font-semibold text-xs tracking-widest uppercase hover:bg-neutral-200 transition-all cursor-pointer whitespace-nowrap"
                  >
                    ENTER COLLECTION →
                  </button>
                </div>
              )}
            </main>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 8. MONOCHROME WIREFRAME PRODUCT COLLECTION CATALOG                        */}
        {/* ========================================================================= */}
        {shopFlow === 'catalog' && selectedCategory && (
          <div className="fixed inset-0 z-[100] overflow-y-auto bg-white">
            <CollectionCatalog
              initialCategory={selectedCategory}
              cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
              onBackToCategories={() => setShopFlow('category-select')}
              onSelectProduct={(prod) => {
                setSelectedProduct(prod);
                setShopFlow('pdp');
              }}
              onOpenCart={() => setIsCartOpen(true)}
              onOpenAccount={() => setIsAccountOpen(true)}
              onAddToCart={handleAddToCart}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* 9. PRODUCT DETAIL PAGE (PDP)                                              */}
        {/* ========================================================================= */}
        {shopFlow === 'pdp' && selectedProduct && (
          <div className="fixed inset-0 z-[100] overflow-y-auto bg-white">
            <ProductDetail
              product={selectedProduct}
              cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
              onSelectProduct={(prod) => {
                setSelectedProduct(prod);
              }}
              onBackToCatalog={() => setShopFlow('catalog')}
              onBackToCategories={() => setShopFlow('category-select')}
              onOpenCart={() => setIsCartOpen(true)}
              onOpenAccount={() => setIsAccountOpen(true)}
              onAddToCart={handleAddToCart}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* 10. SOPHISTICATED GRAYSCALE WIREFRAME CHECKOUT INTERFACE                  */}
        {/* ========================================================================= */}
        {shopFlow === 'checkout' && (
          <div className="fixed inset-0 z-[100] overflow-y-auto bg-white">
            <Checkout
              items={cartItems}
              onBackToCart={() => {
                setShopFlow(selectedProduct ? 'pdp' : selectedCategory ? 'catalog' : 'category-select');
                setIsCartOpen(true);
              }}
              onOrderComplete={() => {
                setCartItems([]);
              }}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* 11. MINIMAL WIREFRAME CART DRAWER (Slides in from right)                  */}
        {/* ========================================================================= */}
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onAddRecommended={handleAddRecommended}
          onProceedToCheckout={() => {
            setIsCartOpen(false);
            setShopFlow('checkout');
          }}
        />

        {/* ========================================================================= */}
        {/* 12. VAYNE VIP CLIENT ACCOUNT MODAL / DRAWER                               */}
        {/* ========================================================================= */}
        <AccountModal
          isOpen={isAccountOpen}
          onClose={() => setIsAccountOpen(false)}
        />

        {/* ========================================================================= */}
        {/* 13. STITCH VAYNE EDITORIAL PRELOADER WITH BASELINE DOTS & IMAGE CACHING    */}
        {/* ========================================================================= */}
        {showInitialPreloader && (
          <Preloader onComplete={() => setShowInitialPreloader(false)} />
        )}

        {/* ========================================================================= */}
        {/* 14. SHOP TRANSITION MULTI-IMAGE FASHION PRELOADER                          */}
        {/* ========================================================================= */}
        {showShopPreloader && (
          <ShopPreloader onComplete={handleShopPreloaderComplete} mode="shop" />
        )}
      </div>
    </div>
  );
}
