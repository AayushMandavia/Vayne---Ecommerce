import { useState, useEffect, useRef } from 'react';
import {
  ChevronRight,
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  Leaf,
  ShoppingBag,
  User,
  Check,
  ArrowLeft,
  ChevronDown,
} from 'lucide-react';
import { type Product, PRODUCTS } from './data';

interface ProductDetailProps {
  product: Product;
  cartCount: number;
  onSelectProduct: (product: Product) => void;
  onBackToCatalog: () => void;
  onBackToCategories: () => void;
  onOpenCart: () => void;
  onAddToCart: (product: Product, size: string, color: string) => void;
  onOpenAccount?: () => void;
}

interface ProductInspectionAngle {
  id: string;
  index: string;
  name: string;
  description: string;
}

const INSPECTION_ANGLES: ProductInspectionAngle[] = [
  {
    id: 'front',
    index: '01',
    name: 'Front View',
    description: 'Front profile & total drape',
  },
  {
    id: 'back',
    index: '02',
    name: 'Back View',
    description: 'Back silhouette & design',
  },
  {
    id: 'profile',
    index: '03',
    name: 'Side Profile',
    description: 'Lateral drape & tailoring',
  },
  {
    id: 'detail',
    index: '04',
    name: 'Detail & Fabric',
    description: 'Macro textile & finish',
  },
];

export default function ProductDetail({
  product,
  cartCount,
  onSelectProduct,
  onBackToCatalog,
  onBackToCategories,
  onOpenCart,
  onAddToCart,
  onOpenAccount,
}: ProductDetailProps) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.id || '');
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[1] || product.sizes[0] || 'M');
  const [activeAngleIndex, setActiveAngleIndex] = useState<number>(0);
  const [showAddedToast, setShowAddedToast] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>('fabric');

  const primaryCtaRef = useRef<HTMLButtonElement | null>(null);

  // Update selected product state if product changes
  useEffect(() => {
    setActiveAngleIndex(0);
    setSelectedColor(product.colors[0]?.id || '');
    setSelectedSize(product.sizes[1] || product.sizes[0] || 'M');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product]);

  // Observer to toggle sticky bottom bar ONLY after user scrolls past primary Add to Cart button
  useEffect(() => {
    const handleScroll = () => {
      if (!primaryCtaRef.current) return;
      const rect = primaryCtaRef.current.getBoundingClientRect();
      if (rect.bottom < 0) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const selectedColorObj = product.colors.find((c) => c.id === selectedColor) || product.colors[0];

  const handleAddToCart = () => {
    if (product.status === 'SOLD OUT') return;
    onAddToCart(product, selectedSize, selectedColorObj?.name || 'Standard');
    setShowAddedToast(true);
    setTimeout(() => setShowAddedToast(false), 2000);
  };

  // Strictly filter related products from the exact same category
  const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);

  const galleryImages =
    product.gallery && product.gallery.length >= 4
      ? product.gallery
      : [product.image, ...(product.gallery || [])];

  const currentAngle = INSPECTION_ANGLES[activeAngleIndex] || INSPECTION_ANGLES[0];
  const currentImage = galleryImages[activeAngleIndex] || product.image;

  return (
    <div
      className="min-h-screen bg-white text-[#111827] selection:bg-[#111827] selection:text-white antialiased flex flex-col"
      style={{
        fontFamily: "'General Sans', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* ========================================================================= */}
      {/* 1. SLIM TOP NAVIGATION BAR (Centered logo 32px height & discrete links)    */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 h-16 w-full border-b border-[#E5E7EB] bg-white/95 backdrop-blur-md px-6 md:px-12 lg:px-20">
        <div className="max-w-[1440px] mx-auto h-full flex items-center justify-between">
          {/* Left: Back Link & Breadcrumb preview */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToCatalog}
              className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-[#6B7280] hover:text-[#111827] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Catalog</span>
            </button>
          </div>

          {/* Center: Brand Logo Area (32px height wordmark) */}
          <div className="flex items-center justify-center h-8">
            <button
              type="button"
              onClick={onBackToCategories}
              className="font-bold tracking-[0.22em] text-xl text-[#111827] hover:opacity-80 transition-opacity cursor-pointer uppercase"
            >
              VAYNE
            </button>
          </div>

          {/* Right: Discrete text links and Shopping Bag */}
          <div className="flex items-center gap-6 text-sm font-medium">
            <button
              type="button"
              onClick={onBackToCategories}
              className="hidden sm:inline-block text-xs uppercase tracking-wider text-[#6B7280] hover:text-[#111827] transition-colors cursor-pointer"
            >
              Departments
            </button>
            <button
              type="button"
              onClick={onOpenAccount}
              className="p-1 text-[#111827] hover:opacity-70 transition-opacity cursor-pointer"
              aria-label="Account"
            >
              <User className="w-5 h-5" strokeWidth={1.75} />
            </button>
            <button
              type="button"
              onClick={onOpenCart}
              className="relative cursor-pointer p-1 text-[#111827] hover:opacity-70 transition-opacity"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5 text-[#111827]" strokeWidth={1.75} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-[#111827] text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. BREADCRUMBS TRAIL (14px text in #9CA3AF, lucide:chevron-right, active)  */}
      {/* ========================================================================= */}
      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 pt-6 pb-4">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-[#9CA3AF]">
          <button
            type="button"
            onClick={onBackToCategories}
            className="hover:text-[#111827] transition-colors cursor-pointer uppercase tracking-wide"
          >
            COLLECTIONS
          </button>
          <ChevronRight className="w-4 h-4 text-[#9CA3AF] shrink-0" />
          <button
            type="button"
            onClick={onBackToCatalog}
            className="hover:text-[#111827] transition-colors cursor-pointer uppercase tracking-wide"
          >
            {product.category}
          </button>
          <ChevronRight className="w-4 h-4 text-[#9CA3AF] shrink-0" />
          <span className="font-medium text-[#111827] truncate max-w-xs sm:max-w-md uppercase tracking-wide">
            {product.name}
          </span>
        </nav>
      </div>

      {/* ========================================================================= */}
      {/* 3. PRODUCT MAIN SECTION (2-Column Grid: 7:5 ratio gallery 60% / info 40%)  */}
      {/* ========================================================================= */}
      <main className="w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-8 lg:py-12 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* ===================================================================== */}
          {/* LEFT COLUMN: Gallery (7 of 12 cols ~58%)                              */}
          {/* ===================================================================== */}
          <div className="lg:col-span-7 space-y-4">
            {/* Primary Image: 4:5 aspect ratio, #F3F4F6 background, 1px border */}
            <div className="relative aspect-[4/5] bg-[#F3F4F6] border border-[#E5E7EB] overflow-hidden rounded-[2px] group">
              <img
                key={currentImage}
                src={currentImage}
                alt={`${product.name} - ${currentAngle.name}`}
                className="w-full h-full object-cover transition-opacity duration-300 ease-out"
              />

              {/* Angle Indicator Tag */}
              <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-white/95 backdrop-blur-sm border border-[#E5E7EB] rounded-[2px] shadow-sm flex items-center gap-2 text-[#111827]">
                <span className="font-mono text-[10px] font-bold tracking-wider">{currentAngle.index}</span>
                <span className="text-[11px] font-medium uppercase tracking-wider">{currentAngle.name}</span>
                <span className="text-[10px] text-[#6B7280] hidden sm:inline">• {currentAngle.description}</span>
              </div>

              {/* Status Badge */}
              {product.status && (
                <div className="absolute top-4 left-4">
                  {product.status === 'NEW ARRIVAL' ? (
                    <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 bg-white text-[#111827] border border-[#E5E7EB] rounded-[2px] shadow-sm">
                      NEW ARRIVAL
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 bg-[#111827] text-white rounded-[2px]">
                      SOLD OUT
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* 4 Dedicated Multi-Angle Views for THIS exact garment */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {INSPECTION_ANGLES.map((angle, idx) => {
                const isSelected = activeAngleIndex === idx;
                const thumbImage = galleryImages[idx] || product.image;
                return (
                  <button
                    key={angle.id}
                    type="button"
                    onClick={() => setActiveAngleIndex(idx)}
                    className={`relative aspect-[4/5] bg-[#F3F4F6] border overflow-hidden rounded-[2px] group cursor-pointer text-left transition-all ${
                      isSelected
                        ? 'border-[#111827] ring-2 ring-[#111827]'
                        : 'border-[#E5E7EB] hover:border-[#111827]'
                    }`}
                  >
                    <img
                      src={thumbImage}
                      alt={`${product.name} ${angle.name}`}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 text-white">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="font-bold">{angle.index}</span>
                        <span className="uppercase text-[9px] tracking-wider opacity-90 truncate ml-1">{angle.name}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ===================================================================== */}
          {/* RIGHT COLUMN: Sticky Info Container (5 of 12 cols ~42%)               */}
          {/* ===================================================================== */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-6">
              {/* Category & Status */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono tracking-widest text-[#6B7280] uppercase">
                  DROP 01 — 04 ARCHIVE / {product.type}
                </span>
                <span className="text-xs text-[#6B7280] uppercase">ID: {product.id}</span>
              </div>

              {/* 36px H1 title & 24px Price */}
              <div>
                <h1 className="text-4xl font-medium tracking-tight text-[#111827] leading-tight">
                  {product.name}
                </h1>
                <div className="mt-3 flex items-baseline gap-3">
                  <span className="text-2xl font-medium text-[#111827]">{product.price}</span>
                  <span className="text-xs font-mono uppercase tracking-wider text-[#6B7280]">
                    Taxes Included
                  </span>
                </div>
              </div>

              {/* Star-Rating row with underline review link */}
              <div className="flex items-center gap-3 pt-1 border-b border-[#E5E7EB] pb-5">
                <div className="flex text-[#111827]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#111827]" />
                  ))}
                </div>
                <span className="text-sm font-medium text-[#111827]">{product.rating}</span>
                <span className="text-xs text-[#9CA3AF]">/ 5.0</span>
                <span className="text-xs text-[#E5E7EB]">|</span>
                <a
                  href="#reviews"
                  className="text-xs text-[#6B7280] hover:text-[#111827] underline decoration-1 underline-offset-4 transition-colors"
                >
                  {product.reviewCount} Reviews
                </a>
              </div>

              {/* Description (16px, leading 1.6, text #6B7280) */}
              <p className="text-base text-[#6B7280] leading-[1.6] font-normal">
                {product.description}
              </p>

              {/* Variant Section: Colors (40x40px circles with 2px ring on active) */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-[#111827]">
                    Color: <span className="text-[#6B7280] font-normal">{selectedColorObj?.name}</span>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {product.colors.map((c) => {
                    const isActive = selectedColor === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setSelectedColor(c.id)}
                        title={c.name}
                        className={`w-10 h-10 rounded-full border border-[#E5E7EB] transition-all duration-150 cursor-pointer ${
                          isActive
                            ? 'ring-2 ring-[#111827] ring-offset-2 scale-105'
                            : 'hover:scale-105'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Minimalist Variant Selector: Size Grid (cols-4, gap 8px, 48px height, 6px radius) */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-[#111827]">
                    Select Size: <span className="text-[#6B7280] font-normal">{selectedSize}</span>
                  </span>
                  <button
                    type="button"
                    className="text-xs text-[#6B7280] hover:text-[#111827] underline decoration-1 underline-offset-4 cursor-pointer"
                  >
                    Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((s) => {
                    const isAvailable = product.sizes.includes(s);
                    const isActive = selectedSize === s && isAvailable;

                    return (
                      <button
                        key={s}
                        type="button"
                        disabled={!isAvailable}
                        onClick={() => setSelectedSize(s)}
                        className={`h-12 flex items-center justify-center text-sm font-medium rounded-[6px] transition-all duration-150 cursor-pointer ${
                          !isAvailable
                            ? 'bg-[#F9FAFB] text-[#D1D5DB] border border-[#E5E7EB] cursor-not-allowed'
                            : isActive
                            ? 'bg-[#111827] text-white border border-[#111827]'
                            : 'bg-white text-[#111827] border border-[#E5E7EB] hover:bg-[#F9FAFB] hover:border-[#111827]'
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Primary CTA Button: 56px height, rounded 6px, #111827 background, centered text & price */}
              <div className="pt-4 space-y-3">
                <button
                  ref={primaryCtaRef}
                  type="button"
                  onClick={handleAddToCart}
                  disabled={product.status === 'SOLD OUT'}
                  className={`w-full h-14 rounded-[6px] text-sm font-medium tracking-wide uppercase flex items-center justify-center gap-3 transition-all duration-200 cursor-pointer ${
                    product.status === 'SOLD OUT'
                      ? 'bg-[#F9FAFB] text-[#D1D5DB] border border-[#E5E7EB] cursor-not-allowed'
                      : 'bg-[#111827] text-white hover:bg-black active:scale-[0.99]'
                  }`}
                >
                  {product.status === 'SOLD OUT' ? (
                    <span>SOLD OUT — JOIN WAITLIST</span>
                  ) : (
                    <span>ADD TO CART — {product.price}</span>
                  )}
                </button>

                {/* Added Toast feedback */}
                {showAddedToast && (
                  <div className="p-3 bg-[#F9FAFB] border border-[#111827] rounded-[6px] text-xs font-medium text-[#111827] flex items-center justify-center gap-2 animate-in fade-in duration-200">
                    <Check className="w-4 h-4 text-[#111827]" />
                    <span>Added {product.name} ({selectedSize}, {selectedColorObj?.name}) to bag.</span>
                  </div>
                )}
              </div>

              {/* Accordion / Details List */}
              <div className="border-t border-[#E5E7EB] pt-6 space-y-4 text-sm">
                {/* Fabric & Construction */}
                <div className="border-b border-[#E5E7EB] pb-4">
                  <button
                    type="button"
                    onClick={() => setOpenAccordion((prev) => (prev === 'fabric' ? null : 'fabric'))}
                    className="w-full flex items-center justify-between font-medium text-[#111827] text-left cursor-pointer"
                  >
                    <span>Fabric & Construction</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        openAccordion === 'fabric' ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openAccordion === 'fabric' && (
                    <div className="mt-2.5 text-xs text-[#6B7280] leading-relaxed animate-in fade-in duration-150">
                      <p>{product.fabric}</p>
                      <p className="mt-1 font-mono text-[11px] text-[#9CA3AF]">
                        Ethically milled in accordance with Global Recycled Standard (GRS).
                      </p>
                    </div>
                  )}
                </div>

                {/* Fit & Sizing */}
                <div className="border-b border-[#E5E7EB] pb-4">
                  <button
                    type="button"
                    onClick={() => setOpenAccordion((prev) => (prev === 'fit' ? null : 'fit'))}
                    className="w-full flex items-center justify-between font-medium text-[#111827] text-left cursor-pointer"
                  >
                    <span>Fit & Sizing</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        openAccordion === 'fit' ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openAccordion === 'fit' && (
                    <div className="mt-2.5 text-xs text-[#6B7280] leading-relaxed animate-in fade-in duration-150">
                      <p>{product.fit}</p>
                      <p className="mt-1 text-[11px] text-[#9CA3AF]">
                        Model is 6&apos;1&quot; (185cm) wearing Size M.
                      </p>
                    </div>
                  )}
                </div>

                {/* Shipping & Returns */}
                <div className="border-b border-[#E5E7EB] pb-4">
                  <button
                    type="button"
                    onClick={() => setOpenAccordion((prev) => (prev === 'shipping' ? null : 'shipping'))}
                    className="w-full flex items-center justify-between font-medium text-[#111827] text-left cursor-pointer"
                  >
                    <span>Complimentary Shipping & Returns</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        openAccordion === 'shipping' ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openAccordion === 'shipping' && (
                    <div className="mt-2.5 text-xs text-[#6B7280] leading-relaxed animate-in fade-in duration-150">
                      <p>
                        Free carbon-neutral courier delivery on orders over $200. Effortless 30-day returns or store exchanges in original archival packaging.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* 4. SOCIAL PROOF AND BENEFITS (Full-width #F9FAFB, 4-column benefits grid)  */}
      {/* ========================================================================= */}
      <section className="w-full bg-[#F9FAFB] border-y border-[#E5E7EB] py-16 px-6 md:px-12 lg:px-20 mt-16">
        <div className="max-w-[1440px] mx-auto space-y-12">
          {/* Horizontal Star Graphic & Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-8 border-b border-[#E5E7EB]">
            <div className="flex items-center gap-3">
              <div className="flex text-[#111827]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#111827]" />
                ))}
              </div>
              <span className="text-base font-semibold text-[#111827]">
                Rated 4.9/5 by 10,000+ Customers
              </span>
            </div>

            <span className="text-xs font-mono uppercase tracking-widest text-[#6B7280]">
              VERIFIED BUYER ARCHIVE
            </span>
          </div>

          {/* 4-Column Benefits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Benefit 1 */}
            <div className="flex flex-col space-y-3">
              <div className="w-12 h-12 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center text-[#111827]">
                <Truck className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <h3 className="text-base font-medium text-[#111827]">Free Express Shipping</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                Complimentary carbon-neutral express dispatch on all orders over $200.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="flex flex-col space-y-3">
              <div className="w-12 h-12 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center text-[#111827]">
                <ShieldCheck className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <h3 className="text-base font-medium text-[#111827]">Archival Quality</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                Custom-milled heavyweight textiles engineered for structural durability.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="flex flex-col space-y-3">
              <div className="w-12 h-12 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center text-[#111827]">
                <RotateCcw className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <h3 className="text-base font-medium text-[#111827]">Complimentary Returns</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                Seamless 30-day return or exchange policy worldwide with prepaid labels.
              </p>
            </div>

            {/* Benefit 4 */}
            <div className="flex flex-col space-y-3">
              <div className="w-12 h-12 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center text-[#111827]">
                <Leaf className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <h3 className="text-base font-medium text-[#111827]">Sustainable Packaging</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                Zero single-use plastic. Delivered in 100% biodegradable unbleached pulp.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. RELATED PRODUCTS CAROUSEL / GRID (4-column grid, 3:4 cards, 500ms zoom) */}
      {/* ========================================================================= */}
      <section className="w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-20">
        <div className="flex items-end justify-between mb-8 pb-4 border-b border-[#E5E7EB]">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#6B7280]">
              CURATED COMPANIONS
            </span>
            <h2 className="text-2xl font-medium text-[#111827] tracking-tight mt-1">
              Complete The Look
            </h2>
          </div>
          <button
            type="button"
            onClick={onBackToCatalog}
            className="text-xs font-semibold uppercase tracking-wider text-[#111827] hover:underline decoration-1 underline-offset-4 cursor-pointer"
          >
            View All Pieces →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((item) => (
            <article
              key={item.id}
              onClick={() => onSelectProduct(item)}
              className="group flex flex-col cursor-pointer"
            >
              {/* Image Container: 3:4 aspect ratio with 500ms zoom */}
              <div className="relative aspect-[3/4] bg-[#F3F4F6] border border-[#E5E7EB] overflow-hidden rounded-[2px]">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
                />

                {/* Badge (12px uppercase) */}
                {item.status && (
                  <div className="absolute top-3 left-3">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-[2px] ${
                        item.status === 'NEW ARRIVAL'
                          ? 'bg-white text-[#111827] border border-[#E5E7EB]'
                          : 'bg-[#111827] text-white'
                      }`}
                    >
                      {item.status === 'NEW ARRIVAL' ? 'NEW' : 'SOLD OUT'}
                    </span>
                  </div>
                )}
              </div>

              {/* Bottom Metadata: Left-aligned title/category (14px), Right-aligned price (14px bold) */}
              <div className="pt-3.5 flex items-start justify-between gap-2">
                <div className="space-y-0.5 min-w-0">
                  <h4 className="text-sm font-medium text-[#111827] truncate group-hover:underline decoration-1 underline-offset-4 transition-all">
                    {item.name}
                  </h4>
                  <p className="text-xs text-[#6B7280]">{item.type}</p>
                </div>
                <span className="text-sm font-bold text-[#111827] shrink-0">
                  {item.price}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. STICKY CONVERSION BAR (Only appears after scrolling past primary CTA)   */}
      {/* ========================================================================= */}
      <div
        className={`fixed bottom-0 inset-x-0 z-50 bg-white border-t border-[#E5E7EB] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] transition-all duration-300 transform ${
          showStickyBar ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 h-20 flex items-center justify-between">
          {/* Left: 48px square product thumbnail + Title/Variant text stack */}
          <div className="flex items-center gap-3.5 min-w-0">
            <img
              src={product.image}
              alt={product.name}
              className="w-12 h-12 object-cover object-center rounded-[4px] border border-[#E5E7EB] shrink-0"
            />
            <div className="min-w-0">
              <h4 className="text-sm font-medium text-[#111827] truncate">
                {product.name}
              </h4>
              <p className="text-xs text-[#6B7280] truncate font-mono">
                {selectedSize} / {selectedColorObj?.name}
              </p>
            </div>
          </div>

          {/* Right: Price text + 48px height Add to Cart button */}
          <div className="flex items-center gap-4 shrink-0">
            <span className="text-base font-medium text-[#111827] hidden sm:inline-block">
              {product.price}
            </span>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={product.status === 'SOLD OUT'}
              className={`h-12 px-6 sm:px-8 rounded-[6px] text-xs sm:text-sm font-medium uppercase tracking-wider transition-all cursor-pointer ${
                product.status === 'SOLD OUT'
                  ? 'bg-[#F9FAFB] text-[#D1D5DB] border border-[#E5E7EB] cursor-not-allowed'
                  : 'bg-[#111827] text-white hover:bg-black active:scale-[0.98]'
              }`}
            >
              {product.status === 'SOLD OUT' ? 'Sold Out' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 7. FOOTER                                                                 */}
      {/* ========================================================================= */}
      <footer className="border-t border-[#E5E7EB] bg-white py-12 px-6 md:px-12 lg:px-20 text-xs text-[#6B7280]">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold tracking-[0.2em] text-sm text-[#111827]">VAYNE</span>
            <span>—</span>
            <span>CLOTHING FOR WHAT&apos;S NEXT</span>
          </div>
          <div className="flex items-center gap-6">
            <span>© 2026 VAYNE ARCHIVE</span>
            <span>ALL RIGHTS RESERVED</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
