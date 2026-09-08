import { useState, useMemo, useEffect } from 'react';
import { Search, User, ShoppingBag, ArrowLeft, ArrowRight, Check, SlidersHorizontal, X } from 'lucide-react';
import { type Product, PRODUCTS, type CategoryId } from './data';

const CATEGORY_META: Record<
  CategoryId,
  { title: string; subtitle: string; count: string; description: string }
> = {
  men: {
    title: "MEN'S COLLECTION",
    subtitle: 'LOOKBOOK 2026',
    count: '18 PIECES',
    description:
      'Precision-tailored streetwear, oversized architectural outerwear, and elevated foundational staples engineered for modern utilitarian movement.',
  },
  women: {
    title: "WOMEN'S COLLECTION",
    subtitle: 'LOOKBOOK 2026',
    count: '18 PIECES',
    description:
      'Sculptural silhouettes, fluid monochrome silk drape, and refined minimalist tailoring crafted from heavyweight luxury textiles.',
  },
  kids: {
    title: "KIDS' COLLECTION",
    subtitle: 'LOOKBOOK 2026',
    count: '18 PIECES',
    description:
      'Scaled proportion outerwear and elevated foundational staples designed for timeless comfort, playability, and durability.',
  },
};

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const COLORS = [
  { id: 'black', hex: '#000000', name: 'Black' },
  { id: 'charcoal', hex: '#1F2937', name: 'Charcoal' },
  { id: 'slate', hex: '#4B5563', name: 'Slate / Indigo' },
  { id: 'gray', hex: '#9CA3AF', name: 'Heather Gray' },
  { id: 'chalk', hex: '#E5E7EB', name: 'Chalk / Ecru' },
  { id: 'white', hex: '#FFFFFF', name: 'Optic White', bordered: true },
];

const PRICE_RANGES = [
  { id: 'all', label: 'All Prices' },
  { id: 'under-150', label: 'Under $150' },
  { id: '150-300', label: '$150 – $300' },
  { id: 'over-300', label: 'Over $300' },
];

const SORT_OPTIONS = [
  { id: 'featured', label: 'Featured' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'rating', label: 'Highest Rated' },
  { id: 'name-asc', label: 'Alphabetical: A–Z' },
];

const ITEMS_PER_PAGE = 6;

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
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const meta = CATEGORY_META[activeCategory];

  // Dynamically derive available garment types for active category
  const availableTypes = useMemo(() => {
    const types = Array.from(
      new Set(PRODUCTS.filter((p) => p.category === activeCategory).map((p) => p.type))
    );
    return ['All Pieces', ...types];
  }, [activeCategory]);

  // Reset to page 1 whenever any filter, category, or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, selectedType, selectedSize, selectedColor, selectedPriceRange, sortBy, searchQuery]);

  // Filter & Sort products
  const filteredProducts = useMemo(() => {
    let list = PRODUCTS.filter((p) => {
      // Category match
      if (p.category !== activeCategory) return false;

      // Type match
      if (selectedType !== 'All Pieces' && p.type !== selectedType) return false;

      // Size match
      if (selectedSize && !p.sizes.includes(selectedSize)) return false;

      // Color match (compares hex or color name)
      if (
        selectedColor &&
        !p.colors.some(
          (c) =>
            c.hex.toLowerCase() === selectedColor.toLowerCase() ||
            c.id === selectedColor
        )
      ) {
        return false;
      }

      // Price range match
      if (selectedPriceRange === 'under-150' && p.priceNum >= 150) return false;
      if (
        selectedPriceRange === '150-300' &&
        (p.priceNum < 150 || p.priceNum > 300)
      )
        return false;
      if (selectedPriceRange === 'over-300' && p.priceNum <= 300) return false;

      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchType = p.type.toLowerCase().includes(q);
        const matchDesc = p.description.toLowerCase().includes(q);
        if (!matchName && !matchType && !matchDesc) return false;
      }

      return true;
    });

    // Sorting
    if (sortBy === 'price-asc') {
      list = [...list].sort((a, b) => a.priceNum - b.priceNum);
    } else if (sortBy === 'price-desc') {
      list = [...list].sort((a, b) => b.priceNum - a.priceNum);
    } else if (sortBy === 'rating') {
      list = [...list].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'name-asc') {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [activeCategory, selectedType, selectedSize, selectedColor, selectedPriceRange, searchQuery, sortBy]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedProducts = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, safePage]);

  const handlePageChange = (newPage: number) => {
    const clamped = Math.min(Math.max(1, newPage), totalPages);
    setCurrentPage(clamped);
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  const hasActiveFilters =
    selectedType !== 'All Pieces' ||
    selectedSize !== null ||
    selectedColor !== null ||
    selectedPriceRange !== 'all' ||
    searchQuery.trim() !== '';

  const handleResetFilters = () => {
    setSelectedType('All Pieces');
    setSelectedSize(null);
    setSelectedColor(null);
    setSelectedPriceRange('all');
    setSearchQuery('');
    setSortBy('featured');
    setCurrentPage(1);
  };

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
                  handleResetFilters();
                }}
                className={`uppercase tracking-wider transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'text-[#111827] font-semibold underline decoration-2 underline-offset-8'
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

        {/* Right: Search box and icon group */}
        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
            <input
              type="text"
              placeholder="Search collection..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-8 text-xs bg-[#F3F4F6] text-[#111827] placeholder-[#6B7280] border border-transparent rounded-[2px] focus:border-[#E5E7EB] focus:bg-white focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-black"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
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
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#111827] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. COLLECTION HEADER AREA                                                  */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto w-full px-6 lg:px-12 pt-8 pb-4">
        {/* Breadcrumb trail */}
        <nav className="flex items-center gap-2 text-xs text-[#6B7280] tracking-wider uppercase mb-6">
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

        {/* Collection title and metadata bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#E5E7EB]">
          <div>
            <h1 className="text-4xl sm:text-5xl font-semibold text-[#111827] tracking-[-0.025em] uppercase">
              {meta.title}
            </h1>
            <p className="max-w-lg text-sm text-[#6B7280] leading-[1.625] font-normal mt-3">
              {meta.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-[#6B7280] font-medium">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-9 px-3 text-xs bg-white text-[#111827] border border-[#E5E7EB] rounded-[2px] focus:outline-none focus:border-[#111827] cursor-pointer font-medium"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-xs font-mono tracking-widest text-[#6B7280] uppercase">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'ITEM' : 'ITEMS'}
            </div>
          </div>
        </div>

        {/* Mobile Filter Trigger Button */}
        <div className="mt-4 flex lg:hidden items-center justify-between">
          <button
            type="button"
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            className="flex items-center gap-2 px-4 py-2 border border-[#E5E7EB] text-xs font-semibold uppercase tracking-wider text-[#111827] rounded-[2px]"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters {hasActiveFilters ? '(Active)' : ''}</span>
          </button>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs text-[#6B7280] hover:text-[#111827] underline"
            >
              Reset All
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MAIN CATALOG AREA: SIDEBAR + PRODUCT GRID                               */}
      {/* ========================================================================= */}
      <main className="max-w-7xl mx-auto w-full px-6 lg:px-12 py-8 flex-grow">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* SIDEBAR FILTERS (Desktop + Mobile expandable) */}
          <aside className={`w-full lg:w-64 shrink-0 space-y-8 ${isMobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
            {/* Category / Garment Type Filter */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#111827]">
                  Category Type
                </h3>
                {selectedType !== 'All Pieces' && (
                  <button
                    type="button"
                    onClick={() => setSelectedType('All Pieces')}
                    className="text-[11px] text-[#6B7280] hover:text-[#111827] underline cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="space-y-2.5">
                {availableTypes.map((type) => {
                  const isChecked = selectedType === type;
                  return (
                    <label
                      key={type}
                      className="flex items-center gap-3 text-sm text-[#111827] cursor-pointer group"
                    >
                      <input
                        type="radio"
                        name="garmentType"
                        checked={isChecked}
                        onChange={() => setSelectedType(type)}
                        className="w-4 h-4 rounded-full border border-[#E5E7EB] text-[#111827] accent-[#111827] focus:ring-0 cursor-pointer"
                      />
                      <span className={`text-sm transition-colors ${isChecked ? 'font-semibold text-black' : 'font-normal text-[#4B5563] group-hover:text-black'}`}>
                        {type}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[#E5E7EB]" />

            {/* Price Filter */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#111827]">
                  Price
                </h3>
                {selectedPriceRange !== 'all' && (
                  <button
                    type="button"
                    onClick={() => setSelectedPriceRange('all')}
                    className="text-[11px] text-[#6B7280] hover:text-[#111827] underline cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {PRICE_RANGES.map((range) => {
                  const isChecked = selectedPriceRange === range.id;
                  return (
                    <label
                      key={range.id}
                      className="flex items-center gap-3 text-sm text-[#111827] cursor-pointer group"
                    >
                      <input
                        type="radio"
                        name="priceRange"
                        checked={isChecked}
                        onChange={() => setSelectedPriceRange(range.id)}
                        className="w-4 h-4 rounded-full border border-[#E5E7EB] text-[#111827] accent-[#111827] focus:ring-0 cursor-pointer"
                      />
                      <span className={`text-sm transition-colors ${isChecked ? 'font-semibold text-black' : 'font-normal text-[#4B5563] group-hover:text-black'}`}>
                        {range.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[#E5E7EB]" />

            {/* Size Filter */}
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

            {/* Color Filter */}
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
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="w-full py-2.5 text-xs uppercase tracking-wider font-semibold text-[#111827] border border-[#E5E7EB] hover:border-[#111827] transition-colors rounded-[2px] cursor-pointer"
              >
                Reset All Filters
              </button>
            )}
          </aside>

          {/* ======================================================================= */}
          {/* PRODUCT GRID                                                            */}
          {/* ======================================================================= */}
          <section className="flex-1 flex flex-col justify-between">
            {filteredProducts.length === 0 ? (
              <div className="py-20 text-center border border-dashed border-[#E5E7EB] rounded-[2px]">
                <p className="text-sm text-[#6B7280] font-normal mb-3">
                  No garments match the current filters.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs uppercase tracking-wider font-semibold text-[#111827] underline underline-offset-4 cursor-pointer"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {paginatedProducts.map((product) => {
                    const isAdded = addedProductId === product.id;

                    return (
                      <article
                        key={product.id}
                        className="group flex flex-col cursor-pointer"
                        onClick={() => onSelectProduct(product)}
                      >
                        {/* Image Container: 3:4 Aspect Ratio */}
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

                          {/* Status Badges */}
                          {product.status && (
                            <div className="absolute top-3 left-3">
                              {product.status === 'NEW ARRIVAL' ? (
                                <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-1 bg-white text-[#111827] border border-[#E5E7EB] rounded-[2px] shadow-sm">
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
                              {product.sizes.slice(0, 4).map((s) => (
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

                        {/* Product Meta details */}
                        <div className="pt-4 flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-mono tracking-wider text-[#6B7280] uppercase">
                              {product.type}
                            </span>
                            <span className="text-xs font-semibold text-[#111827]">
                              {product.price}
                            </span>
                          </div>

                          <h2 className="text-sm font-medium text-[#111827] group-hover:text-black transition-colors line-clamp-1">
                            {product.name}
                          </h2>

                          {/* Color Swatch Dots */}
                          <div className="flex items-center gap-1.5 mt-1">
                            {product.colors.map((c) => (
                              <span
                                key={c.id}
                                title={c.name}
                                className="w-2.5 h-2.5 rounded-full border border-black/10"
                                style={{ backgroundColor: c.hex }}
                              />
                            ))}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ======================================================================= */}
            {/* 4. PAGINATION: Working Dynamic Pagination                                */}
            {/* ======================================================================= */}
            {filteredProducts.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-12 mt-8 border-t border-[#E5E7EB]">
                <p className="text-xs text-[#6B7280] font-mono uppercase tracking-wider">
                  Showing {Math.min((safePage - 1) * ITEMS_PER_PAGE + 1, filteredProducts.length)}–
                  {Math.min(safePage * ITEMS_PER_PAGE, filteredProducts.length)} of{' '}
                  {filteredProducts.length} items
                </p>

                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => handlePageChange(safePage - 1)}
                    disabled={safePage <= 1}
                    className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#111827] disabled:text-[#9CA3AF] disabled:cursor-not-allowed hover:opacity-70 transition-opacity cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Prev</span>
                  </button>

                  {/* Center Numeric List */}
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => handlePageChange(page)}
                        className={`w-8 h-8 flex items-center justify-center text-xs font-semibold rounded-[2px] cursor-pointer transition-colors ${
                          safePage === page
                            ? 'bg-[#111827] text-white shadow-sm'
                            : 'border border-[#E5E7EB] text-[#6B7280] hover:border-[#111827] hover:text-[#111827]'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => handlePageChange(safePage + 1)}
                    disabled={safePage >= totalPages}
                    className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#111827] disabled:text-[#9CA3AF] disabled:cursor-not-allowed hover:opacity-70 transition-opacity cursor-pointer"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* 5. FOOTER                                                                 */}
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
            <span>© 2026 VAYNE</span>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-[#111827] hover:underline cursor-pointer"
            >
              Back to top ↑
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
