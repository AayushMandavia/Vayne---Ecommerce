import { useState, useMemo } from 'react';
import { Search, User, ShoppingBag, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { type Product, PRODUCTS, type CategoryId } from './data';

const CATEGORY_META: Record<
  CategoryId,
  { title: string; subtitle: string; count: string; description: string }
> = {
  men: {
    title: "MEN'S COLLECTION",
    subtitle: 'DROP 01 — 04 ARCHIVE',
    count: '24 PIECES',
    description:
      'Precision-tailored streetwear and oversized architectural essentials engineered for modern utilitarian movement.',
  },
  women: {
    title: "WOMEN'S COLLECTION",
    subtitle: 'DROP 01 — 04 ARCHIVE',
    count: '32 PIECES',
    description:
      'Sculptural silhouettes, fluid monochrome drape, and refined minimalist tailoring crafted from heavyweight textiles.',
  },
  kids: {
    title: "KIDS' COLLECTION",
    subtitle: 'DROP 01 — 04 ARCHIVE',
    count: '18 PIECES',
    description:
      'Scaled proportion outerwear and elevated foundational staples designed for timeless comfort and durability.',
  },
};

const FILTER_TYPES = ['All Pieces', 'Outerwear', 'Tops', 'T-Shirts', 'Trousers'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const COLORS = [
  { id: 'black', hex: '#000000', name: 'Black' },
  { id: 'charcoal', hex: '#1F2937', name: 'Charcoal' },
  { id: 'slate', hex: '#4B5563', name: 'Slate' },
  { id: 'gray', hex: '#9CA3AF', name: 'Heather Gray' },
  { id: 'chalk', hex: '#E5E7EB', name: 'Chalk' },
  { id: 'white', hex: '#FFFFFF', name: 'White', bordered: true },
];

interface CollectionCatalogProps {
  initialCategory: CategoryId;
  cartCount: number;
  onBackToCategories: () => void;
  onSelectProduct: (product: Product) => void;
  onOpenCart: () => void;
  onAddToCart: (product: Product, size: string, color: string) => void;
}

export default function CollectionCatalog({
  initialCategory,
  cartCount,
  onBackToCategories,
  onSelectProduct,
  onOpenCart,
  onAddToCart,
}: CollectionCatalogProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryId>(initialCategory);
  const [selectedType, setSelectedType] = useState<string>('All Pieces');
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const meta = CATEGORY_META[activeCategory];

  // Filter products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (p.category !== activeCategory) return false;
      if (selectedType !== 'All Pieces' && p.type !== selectedType) return false;
      if (selectedSize && !p.sizes.includes(selectedSize)) return false;
      if (selectedColor && !p.colors.some((c) => c.hex === selectedColor)) return false;
      if (searchQuery.trim() && !p.name.toLowerCase().includes(searchQuery.toLowerCase()))
        return false;
      return true;
    });
  }, [activeCategory, selectedType, selectedSize, selectedColor, searchQuery]);

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.status === 'SOLD OUT') return;
    onAddToCart(
      product,
      product.sizes[1] || product.sizes[0] || 'M',
      product.colors[0]?.name || 'Standard'
    );
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 1800);
  };

  return (
    <div
      className="min-h-screen bg-white text-[#111827] selection:bg-[#111827] selection:text-white flex flex-col antialiased"
      style={{
        fontFamily: "'General Sans', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* ========================================================================= */}
      {/* 1. STICKY HEADER (64px height, #FFFFFF 95% opacity backdrop-blur)          */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 h-16 w-full border-b border-[#E5E7EB] bg-white/95 backdrop-blur-md px-6 lg:px-12 flex items-center justify-between">
        {/* Left: Brand Logo Wordmark */}
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={onBackToCategories}
            className="text-left group cursor-pointer"
            title="Return to department selection"
          >
            <span className="font-bold tracking-[0.2em] text-lg text-[#111827] group-hover:opacity-75 transition-opacity">
              VAYNE
            </span>
          </button>
        </div>

        {/* Center: Desktop Navigation with 32px spacing (text-sm, medium weight) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {(['men', 'women', 'kids'] as CategoryId[]).map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setActiveCategory(cat);
                  setSelectedType('All Pieces');
                  setSelectedSize(null);
                  setSelectedColor(null);
                  setCurrentPage(1);
                }}
                className={`uppercase tracking-wider transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'text-[#111827] font-semibold underline decoration-1 underline-offset-8'
                    : 'text-[#6B7280] hover:text-[#111827]'
                }`}
              >
                {cat}
              </button>
            );
          })}
          <span className="text-[#E5E7EB]">|</span>
          <button
            type="button"
            onClick={onBackToCategories}
            className="text-xs uppercase tracking-widest text-[#6B7280] hover:text-[#111827] cursor-pointer"
          >
            All Departments
          </button>
        </nav>

        {/* Right: Search box (256px wide rounded-sm box in #F3F4F6) and icon group */}
        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
            <input
              type="text"
              placeholder="Search collection..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 text-xs bg-[#F3F4F6] text-[#111827] placeholder-[#6B7280] border border-transparent rounded-[2px] focus:border-[#E5E7EB] focus:bg-white focus:outline-none transition-colors"
            />
          </div>

          <button
            type="button"
            className="p-2 text-[#111827] hover:opacity-70 transition-opacity cursor-pointer"
            aria-label="Account"
          >
            <User className="w-5 h-5" strokeWidth={1.75} />
          </button>

          <button
            type="button"
            onClick={onOpenCart}
            className="relative p-2 text-[#111827] hover:opacity-70 transition-opacity cursor-pointer"
            aria-label="Shopping Bag"
          >
            <ShoppingBag className="w-5 h-5" strokeWidth={1.75} />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#111827] text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. COLLECTION HEADER                                                      */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto w-full px-6 lg:px-12 pt-8 sm:pt-12">
        {/* Breadcrumb trail at top using 12px text */}
        <nav className="flex items-center gap-2 text-xs text-[#6B7280] mb-3">
          <button
            type="button"
            onClick={onBackToCategories}
            className="hover:text-[#111827] transition-colors cursor-pointer flex items-center gap-1"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>COLLECTIONS</span>
          </button>
          <span>/</span>
          <span className="uppercase font-medium text-[#111827]">
            {activeCategory}
          </span>
        </nav>

        {/* 36px (text-4xl) font-weight 600 title with -0.025em letter-spacing */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-12 border-b border-[#E5E7EB]">
          <div>
            <h1 className="text-4xl sm:text-5xl font-semibold text-[#111827] tracking-[-0.025em] uppercase">
              {meta.title}
            </h1>
            <p className="max-w-lg text-sm text-[#6B7280] leading-[1.625] font-normal mt-3">
              {meta.description}
            </p>
          </div>

          <div className="text-xs font-mono tracking-widest text-[#6B7280] uppercase">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'ITEM' : 'ITEMS'} DISPLAYED
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MAIN CATALOG AREA: 256px SIDEBAR + PRODUCT GRID (24px gaps)            */}
      {/* ========================================================================= */}
      <main className="max-w-7xl mx-auto w-full px-6 lg:px-12 py-8 flex-grow">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* ======================================================================= */}
          {/* SIDEBAR FILTERS (Desktop-only 256px wide, 1px borders)                   */}
          {/* ======================================================================= */}
          <aside className="w-full lg:w-64 shrink-0 space-y-8">
            {/* Category / Garment Type Filter */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#111827] mb-4">
                Category
              </h3>
              <div className="space-y-2.5">
                {FILTER_TYPES.map((type) => {
                  const isChecked = selectedType === type;
                  return (
                    <label
                      key={type}
                      className="flex items-center gap-3 text-sm text-[#111827] cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => setSelectedType(type)}
                        className="w-4 h-4 rounded-none border border-[#E5E7EB] text-[#111827] accent-[#111827] focus:ring-0 cursor-pointer"
                      />
                      <span className="text-sm font-normal text-[#111827] group-hover:text-black transition-colors">
                        {type}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[#E5E7EB]" />

            {/* Size Filter: 3-column grid of 40px squares with centered 12px text */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#111827]">
                  Size
                </h3>
                {selectedSize && (
                  <button
                    type="button"
                    onClick={() => setSelectedSize(null)}
                    className="text-[11px] text-[#6B7280] hover:text-[#111827] underline cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {SIZES.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() =>
                        setSelectedSize((prev) => (prev === size ? null : size))
                      }
                      className={`h-10 flex items-center justify-center text-xs font-normal transition-all duration-150 rounded-[2px] cursor-pointer ${
                        isSelected
                          ? 'border border-[#111827] bg-[#111827] text-white font-medium'
                          : 'border border-[#E5E7EB] text-[#6B7280] hover:border-[#111827] hover:text-[#111827] bg-white'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[#E5E7EB]" />

            {/* Color Filter: 24px circles with 2px ring-offsets */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#111827]">
                  Color Palette
                </h3>
                {selectedColor && (
                  <button
                    type="button"
                    onClick={() => setSelectedColor(null)}
                    className="text-[11px] text-[#6B7280] hover:text-[#111827] underline cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                {COLORS.map((col) => {
                  const isSelected = selectedColor === col.hex;
                  return (
                    <button
                      key={col.id}
                      type="button"
                      title={col.name}
                      onClick={() =>
                        setSelectedColor((prev) =>
                          prev === col.hex ? null : col.hex
                        )
                      }
                      className={`w-6 h-6 rounded-full transition-all duration-150 cursor-pointer relative ${
                        col.bordered ? 'border border-[#E5E7EB]' : ''
                      } ${
                        isSelected
                          ? 'ring-2 ring-offset-2 ring-[#111827] scale-110'
                          : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: col.hex }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Clear All Filters */}
            {(selectedType !== 'All Pieces' || selectedSize || selectedColor) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedType('All Pieces');
                  setSelectedSize(null);
                  setSelectedColor(null);
                }}
                className="w-full py-2.5 text-xs uppercase tracking-wider font-medium text-[#111827] border border-[#E5E7EB] hover:border-[#111827] transition-colors rounded-[2px] cursor-pointer"
              >
                Reset All Filters
              </button>
            )}
          </aside>

          {/* ======================================================================= */}
          {/* PRODUCT GRID: 3-column layout (xl screens) and 24px gaps                 */}
          {/* ======================================================================= */}
          <section className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="py-20 text-center border border-dashed border-[#E5E7EB] rounded-[2px]">
                <p className="text-sm text-[#6B7280] font-normal mb-3">
                  No garments matching the selected filters.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedType('All Pieces');
                    setSelectedSize(null);
                    setSelectedColor(null);
                    setSearchQuery('');
                  }}
                  className="text-xs uppercase tracking-wider font-semibold text-[#111827] underline underline-offset-4 cursor-pointer"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => {
                  const isAdded = addedProductId === product.id;

                  return (
                    <article
                      key={product.id}
                      className="group flex flex-col cursor-pointer"
                      onClick={() => onSelectProduct(product)}
                    >
                      {/* Image Container: EXACT 3:4 Aspect Ratio, #F3F4F6 background */}
                      <div className="relative aspect-[3/4] bg-[#F3F4F6] overflow-hidden border border-[#E5E7EB] rounded-[2px]">
                        <img
                          src={product.image}
                          alt={product.name}
                          loading="lazy"
                          className="w-full h-full object-cover object-center transition-all duration-500 group-hover:scale-[1.03]"
                          style={{
                            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                          }}
                        />

                        {/* Status Badges (10px font size, bold tracking-wider uppercase) */}
                        {product.status && (
                          <div className="absolute top-3 left-3">
                            {product.status === 'NEW ARRIVAL' ? (
                              <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-1 bg-white text-[#111827] border border-[#E5E7EB] rounded-[2px]">
                                NEW ARRIVAL
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-1 bg-[#111827] text-white rounded-[2px]">
                                SOLD OUT
                              </span>
                            )}
                          </div>
                        )}

                        {/* Quick Size Selector Grid overlay on bottom */}
                        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-white/95 via-white/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-between">
                          <div className="flex gap-1">
                            {product.sizes.map((s) => (
                              <span
                                key={s}
                                className="w-6 h-6 flex items-center justify-center text-[10px] font-medium border border-[#E5E7EB] bg-white text-[#111827] rounded-[2px]"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                          <button
                            type="button"
                            onClick={(e) => handleQuickAdd(product, e)}
                            className="text-[11px] font-semibold tracking-wider text-[#111827] uppercase hover:underline cursor-pointer"
                          >
                            {product.status === 'SOLD OUT' ? 'UNAVAILABLE' : '+ QUICK ADD'}
                          </button>
                        </div>

                        {/* Added to Bag Toast inside card */}
                        {isAdded && (
                          <div className="absolute inset-0 bg-[#111827]/90 text-white flex flex-col items-center justify-center gap-2 animate-in fade-in duration-150 z-20">
                            <Check className="w-6 h-6 text-white" />
                            <span className="text-xs font-semibold uppercase tracking-wider">
                              Added to Bag
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Product Title below image in 14px medium weight text */}
                      <div className="pt-3.5 space-y-1">
                        <h4 className="text-sm font-medium text-[#111827] group-hover:underline decoration-1 underline-offset-4 transition-all">
                          {product.name}
                        </h4>
                        <p className="text-xs text-[#9CA3AF] line-clamp-1 font-normal">
                          {product.description}
                        </p>
                        {/* Price in #6B7280 */}
                        <p className="text-sm font-normal text-[#6B7280]">
                          {product.price}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {/* ======================================================================= */}
            {/* 4. PAGINATION                                                            */}
            {/* ======================================================================= */}
            <div className="mt-12 pt-8 border-t border-[#E5E7EB] flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-2 text-sm font-medium text-[#111827] disabled:text-[#9CA3AF] disabled:cursor-not-allowed hover:opacity-70 transition-opacity cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              {/* Center Numeric List */}
              <div className="flex items-center gap-2">
                {[1, 2, 3].map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 flex items-center justify-center text-xs font-medium rounded-none cursor-pointer transition-colors ${
                      currentPage === page
                        ? 'bg-[#111827] text-white'
                        : 'border border-[#E5E7EB] text-[#6B7280] hover:border-[#111827] hover:text-[#111827]'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(3, p + 1))}
                disabled={currentPage === 3}
                className="flex items-center gap-2 text-sm font-medium text-[#111827] disabled:text-[#9CA3AF] disabled:cursor-not-allowed hover:opacity-70 transition-opacity cursor-pointer"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* FOOTER                                                                    */}
      {/* ========================================================================= */}
      <footer className="border-t border-[#E5E7EB] bg-[#F9FAFB] mt-16 py-12 px-6 lg:px-12 text-xs text-[#6B7280]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold tracking-[0.2em] text-sm text-[#111827]">
              VAYNE
            </span>
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
