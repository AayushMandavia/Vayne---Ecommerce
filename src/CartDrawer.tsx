import { useEffect, useRef } from 'react';
import {
  X,
  Minus,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Image as ImageIcon,
} from 'lucide-react';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: string;
  priceNum: number;
  image: string;
  color: string;
  size: string;
  quantity: number;
}

export interface RecommendedProduct {
  id: string;
  name: string;
  price: string;
  priceNum: number;
  image: string;
  color?: string;
  size?: string;
}

const DEFAULT_RECOMMENDED: RecommendedProduct[] = [
  {
    id: 'rec-01',
    name: 'Archival Canvas Tote',
    price: '$75.00',
    priceNum: 75,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop',
    color: 'Raw Canvas',
    size: 'OS',
  },
  {
    id: 'rec-02',
    name: 'Ribbed Merino Beanie',
    price: '$65.00',
    priceNum: 65,
    image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=600&auto=format&fit=crop',
    color: 'Onyx Black',
    size: 'OS',
  },
  {
    id: 'rec-03',
    name: 'Italian Leather Cardholder',
    price: '$85.00',
    priceNum: 85,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=600&auto=format&fit=crop',
    color: 'Matte Black',
    size: 'OS',
  },
  {
    id: 'rec-04',
    name: 'Heavy Cotton Socks (3-Pack)',
    price: '$35.00',
    priceNum: 35,
    image: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?q=80&w=600&auto=format&fit=crop',
    color: 'Heather Grey',
    size: 'M/L',
  },
];

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedToCheckout?: () => void;
  onAddRecommended?: (product: RecommendedProduct) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onAddRecommended,
}: CartDrawerProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.priceNum * item.quantity, 0);

  const handleScrollRecommended = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -160 : 160;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[200] transition-opacity duration-300 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      style={{
        fontFamily: "'General Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* OVERLAY BACKDROP */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-gray-900/30 backdrop-blur-[2px] transition-opacity cursor-pointer"
      />

      {/* DRAWER CONTAINER */}
      <div
        className={`absolute right-0 top-0 bottom-0 w-full max-w-[420px] bg-white h-full shadow-2xl flex flex-col border-l border-gray-200 transform transition-transform duration-300 ease-out z-10 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* ===================================================================== */}
        {/* 1. HEADER                                                             */}
        {/* ===================================================================== */}
        <header className="flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0 bg-white">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-gray-900 tracking-tight">Your Cart</h2>
            <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full font-mono">
              {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            className="text-gray-400 hover:text-gray-900 transition-colors p-2 -mr-2 rounded-full hover:bg-gray-50 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </header>

        {/* ===================================================================== */}
        {/* 2. SCROLLABLE CONTENT (Cart items + Divider + Recommended section)    */}
        {/* ===================================================================== */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {/* Cart Items List */}
          {items.length === 0 ? (
            <div className="p-8 text-center space-y-3 my-8">
              <div className="w-16 h-16 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center mx-auto text-gray-400">
                <ImageIcon className="w-7 h-7" />
              </div>
              <p className="text-base font-medium text-gray-900">Your cart is empty</p>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Explore our collections or add foundational archival items below.
              </p>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 group">
                  {/* Wireframe Image Box with diagonal line border overlay */}
                  <div className="w-20 h-24 bg-gray-100 flex items-center justify-center text-gray-300 relative overflow-hidden shrink-0 border border-gray-200 rounded-[2px]">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover object-center"
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-gray-300" />
                    )}
                  </div>

                  {/* Details column */}
                  <div className="flex-1 flex flex-col justify-between py-0.5">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-medium text-gray-900 leading-snug text-sm">
                          {item.name}
                        </h3>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.id)}
                          aria-label={`Remove ${item.name}`}
                          className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-0.5 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 font-mono">
                        {item.color} / Size {item.size}
                      </p>
                    </div>

                    <div className="flex justify-between items-end pt-2">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-gray-200 rounded-sm bg-white">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          aria-label="Decrease quantity"
                          className="px-2 py-1 hover:bg-gray-50 text-gray-500 transition-colors cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs w-6 text-center font-medium text-gray-900 select-none">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          aria-label="Increase quantity"
                          className="px-2 py-1 hover:bg-gray-50 text-gray-500 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <span className="font-semibold text-gray-900 text-sm">
                        ${(item.priceNum * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Horizontal Divider */}
          <div className="h-px w-full bg-gray-100" />

          {/* =================================================================== */}
          {/* 3. RECOMMENDED PRODUCTS SECTION (3-4 small product cards in a row)  */}
          {/* =================================================================== */}
          <div className="p-6 bg-gray-50/50">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                Recommended for you
              </h4>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => handleScrollRecommended('left')}
                  aria-label="Scroll left"
                  className="w-6 h-6 flex items-center justify-center border border-gray-200 bg-white rounded-full text-gray-400 hover:text-gray-900 hover:border-gray-400 transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleScrollRecommended('right')}
                  aria-label="Scroll right"
                  className="w-6 h-6 flex items-center justify-center border border-gray-200 bg-white rounded-full text-gray-400 hover:text-gray-900 hover:border-gray-400 transition-all cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto no-scrollbar pb-2 scroll-smooth"
            >
              {DEFAULT_RECOMMENDED.map((rec) => (
                <div
                  key={rec.id}
                  onClick={() => onAddRecommended?.(rec)}
                  className="min-w-[140px] max-w-[140px] bg-white border border-gray-100 p-3 group cursor-pointer hover:border-gray-300 transition-colors shrink-0 rounded-[2px]"
                >
                  <div className="aspect-square bg-gray-100 mb-3 flex items-center justify-center text-gray-300 relative overflow-hidden rounded-[2px]">
                    <img
                      src={rec.image}
                      alt={rec.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Wireframe Add Overlay with plus icon */}
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <div className="bg-white p-2 rounded-full shadow-sm text-gray-900 hover:scale-110 transition-transform">
                        <Plus className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                  <h5 className="text-sm font-medium text-gray-900 truncate" title={rec.name}>
                    {rec.name}
                  </h5>
                  <p className="text-xs text-gray-500 mt-1 font-mono">{rec.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 4. FOOTER / CHECKOUT CTA                                              */}
        {/* ===================================================================== */}
        <div className="bg-white border-t border-gray-200 p-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)] shrink-0">
          <div className="flex justify-between items-center mb-2 text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center mb-6 text-sm">
            <span className="text-gray-500">Shipping</span>
            <span className="text-gray-900 font-medium">
              {subtotal >= 200 && subtotal > 0
                ? 'Complimentary Express'
                : 'Calculated at next step'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              onProceedToCheckout?.();
            }}
            disabled={items.length === 0}
            className={`w-full bg-gray-900 hover:bg-black text-white py-4 px-6 font-medium tracking-wide flex items-center justify-center gap-2 group transition-all duration-300 rounded-[2px] cursor-pointer active:scale-[0.99] text-sm ${
              items.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <p className="text-center text-xs text-gray-400 mt-4">
            Secure checkout powered by Stripe
          </p>
        </div>
      </div>
    </div>
  );
}
