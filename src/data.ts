export type CategoryId = 'men' | 'women' | 'kids';

export interface Product {
  id: string;
  name: string;
  category: CategoryId;
  type: string;
  price: string;
  priceNum: number;
  image: string;
  gallery: string[];
  status?: 'NEW ARRIVAL' | 'SOLD OUT';
  colors: { id: string; hex: string; name: string }[];
  sizes: string[];
  description: string;
  fabric: string;
  fit: string;
  rating: number;
  reviewCount: number;
}

export const PRODUCTS: Product[] = [
  // ==========================================
  // MEN'S COLLECTION
  // ==========================================
  {
    id: 'm-01',
    name: 'Heavyweight Boxy Tee',
    category: 'men',
    type: 'T-Shirts',
    price: '$95.00',
    priceNum: 95,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop',
    ],
    status: 'NEW ARRIVAL',
    colors: [
      { id: 'black', hex: '#000000', name: 'Onyx Black' },
      { id: 'white', hex: '#FFFFFF', name: 'Chalk White' },
      { id: 'slate', hex: '#4B5563', name: 'Mineral Slate' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description:
      'Engineered in custom 320 GSM long-staple combed cotton jersey. Cut with intentional boxy proportions, dropped shoulder seams, and a reinforced high-density ribbed crew collar designed to retain structure over continuous wear.',
    fabric: '100% Combed Heavyweight Cotton (320 GSM). Pre-shrunk with enzyme wash.',
    fit: 'Oversized boxy silhouette. We recommend taking your standard size for the intended relaxed fit.',
    rating: 4.9,
    reviewCount: 142,
  },
  {
    id: 'm-02',
    name: 'Pleated Wool Wide Trousers',
    category: 'men',
    type: 'Trousers',
    price: '$280.00',
    priceNum: 280,
    image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop',
    ],
    colors: [
      { id: 'black', hex: '#000000', name: 'Pitch Black' },
      { id: 'charcoal', hex: '#1F2937', name: 'Deep Charcoal' },
      { id: 'chalk', hex: '#E5E7EB', name: 'Off-White Wool' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description:
      'Tailored from high-twist tropical virgin wool for effortless fluidity and crease-resistance. Features double forward pleats, hidden horn waistband tab closures, and a generous full-length break.',
    fabric: '100% Virgin Tropical Wool with cupro half-lining.',
    fit: 'High-rise with a generous straight-wide leg. Hemmed to rest softly on low footwear.',
    rating: 4.8,
    reviewCount: 96,
  },
  {
    id: 'm-03',
    name: 'Architectural Trench Coat',
    category: 'men',
    type: 'Outerwear',
    price: '$620.00',
    priceNum: 620,
    image: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1544022613-e87ce7526edb?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1520975954732-35dd22299614?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=1000&auto=format&fit=crop',
    ],
    status: 'NEW ARRIVAL',
    colors: [
      { id: 'black', hex: '#000000', name: 'Caviar' },
      { id: 'chalk', hex: '#E5E7EB', name: 'Raw Twill' },
    ],
    sizes: ['S', 'M', 'L'],
    description:
      'A sculptural outerwear centerpiece built from bonded water-repellent gabardine twill. Engineered with dramatic lapels, an inverted rear storm gusset, and matte finished metal D-ring belt hardware.',
    fabric: 'Bonded Cotton Twill with fluorocarbon-free water-resistant coating.',
    fit: 'Substantial cocoon drape with raglan sleeves designed to layer over tailoring or heavy knitwear.',
    rating: 5.0,
    reviewCount: 54,
  },
  {
    id: 'm-04',
    name: 'Minimalist Zip Blouson',
    category: 'men',
    type: 'Outerwear',
    price: '$390.00',
    priceNum: 390,
    image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop',
    ],
    colors: [
      { id: 'black', hex: '#000000', name: 'Black' },
      { id: 'slate', hex: '#4B5563', name: 'Graphite' },
    ],
    sizes: ['M', 'L', 'XL', 'XXL'],
    description:
      'Refined utilitarian jacket tailored in dense technical matte poplin. Features a two-way brushed silver RiRi zipper, seamless jet pockets, and elasticated hem inserts.',
    fabric: 'High-density matte nylon-cotton blend lined in silk-touch cupro.',
    fit: 'Boxy cropped torso with elongated sleeves.',
    rating: 4.8,
    reviewCount: 78,
  },
  {
    id: 'm-05',
    name: 'Raw Edge Structured Blazer',
    category: 'men',
    type: 'Outerwear',
    price: '$480.00',
    priceNum: 480,
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=1000&auto=format&fit=crop',
    ],
    status: 'SOLD OUT',
    colors: [{ id: 'black', hex: '#000000', name: 'Raw Black' }],
    sizes: ['M', 'L'],
    description:
      'Single-breasted architectural blazer with deconstructed unpadded shoulders and delicate hand-finished raw edge seam details.',
    fabric: '100% Wool Hopsack woven in Biella, Italy.',
    fit: 'Structured modern silhouette with extended waist darting.',
    rating: 4.9,
    reviewCount: 31,
  },
  {
    id: 'm-06',
    name: 'French Terry Oversized Hoodie',
    category: 'men',
    type: 'Tops',
    price: '$210.00',
    priceNum: 210,
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop',
    ],
    colors: [
      { id: 'black', hex: '#000000', name: 'Black' },
      { id: 'slate', hex: '#4B5563', name: 'Heather Charcoal' },
      { id: 'white', hex: '#FFFFFF', name: 'Optic White' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description:
      'Heavyweight 500 GSM loopback cotton fleece. Features a seamless double-layer crossover hood, concealed side-seam pockets, and heavyweight 2x2 ribbed hems.',
    fabric: '100% Organic Heavy French Terry (500 GSM).',
    fit: 'Relaxed oversized volume with dropped shoulders.',
    rating: 4.9,
    reviewCount: 112,
  },

  // ==========================================
  // WOMEN'S COLLECTION
  // ==========================================
  {
    id: 'w-01',
    name: 'Sculptural Column Dress',
    category: 'women',
    type: 'Dresses',
    price: '$340.00',
    priceNum: 340,
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop',
    ],
    status: 'NEW ARRIVAL',
    colors: [
      { id: 'black', hex: '#000000', name: 'Midnight Noir' },
      { id: 'chalk', hex: '#E5E7EB', name: 'Alabaster' },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    description:
      'Constructed in fluid heavyweight stretch-crepe. Designed with a clean high bateau neckline, sculptural side darting, and an invisible rear zip extending to a subtle floor-length walking vent.',
    fabric: '96% Viscose, 4% Elastane double-weave crepe.',
    fit: 'Straight column silhouette that softly outlines without constricting.',
    rating: 4.9,
    reviewCount: 88,
  },
  {
    id: 'w-02',
    name: 'Oversized Cocoon Coat',
    category: 'women',
    type: 'Outerwear',
    price: '$590.00',
    priceNum: 590,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?q=80&w=1000&auto=format&fit=crop',
    ],
    colors: [
      { id: 'black', hex: '#000000', name: 'Black' },
      { id: 'charcoal', hex: '#1F2937', name: 'Charcoal' },
      { id: 'gray', hex: '#9CA3AF', name: 'Pebble Gray' },
    ],
    sizes: ['S', 'M', 'L'],
    description:
      'Double-faced felted virgin wool tailored with dramatic rounded sleeve articulation and an understated single-button closure.',
    fabric: '100% Double-Face Virgin Wool. Hand-stitched seams.',
    fit: 'Sculptural cocoon silhouette with room for voluminous knits.',
    rating: 4.9,
    reviewCount: 65,
  },
  {
    id: 'w-03',
    name: 'Minimalist Poplin Shirt',
    category: 'women',
    type: 'Tops',
    price: '$180.00',
    priceNum: 180,
    image: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=1000&auto=format&fit=crop',
    ],
    status: 'NEW ARRIVAL',
    colors: [
      { id: 'white', hex: '#FFFFFF', name: 'Crisp White' },
      { id: 'black', hex: '#000000', name: 'Inky Black' },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    description:
      'Crisp 120-two-ply organic Giza cotton poplin with a concealed mother-of-pearl placket and extended French fold-back cuffs.',
    fabric: '100% Giza Egyptian Long-Staple Cotton.',
    fit: 'Oversized menswear-inspired cut with a curved stepped hemline.',
    rating: 4.8,
    reviewCount: 73,
  },
  {
    id: 'w-04',
    name: 'Tailored Pleated Trousers',
    category: 'women',
    type: 'Trousers',
    price: '$260.00',
    priceNum: 260,
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?q=80&w=1000&auto=format&fit=crop',
    ],
    colors: [
      { id: 'black', hex: '#000000', name: 'Black' },
      { id: 'slate', hex: '#4B5563', name: 'Steel Gray' },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    description:
      'High-rise waistline tailored with deep knife pleats and an elongated wide-leg profile that breaks gracefully over architectural heels.',
    fabric: 'Fine Wool Gabardine with cupro pocketing.',
    fit: 'High-waisted with clean, extended leg length.',
    rating: 4.9,
    reviewCount: 94,
  },
  {
    id: 'w-05',
    name: 'Asymmetric Cashmere Knit',
    category: 'women',
    type: 'Tops',
    price: '$390.00',
    priceNum: 390,
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop',
    ],
    status: 'SOLD OUT',
    colors: [
      { id: 'chalk', hex: '#E5E7EB', name: 'Raw Oatmeal' },
      { id: 'black', hex: '#000000', name: 'Pitch Black' },
    ],
    sizes: ['S', 'M'],
    description:
      'Knit in Inner Mongolia from 7-gauge two-ply pure cashmere yarn. Designed with an asymmetric boat neckline and exaggerated thumbhole cuffs.',
    fabric: '100% Grade-A Mongolian Cashmere.',
    fit: 'Easy slouch fit through the body with fitted sleeves.',
    rating: 5.0,
    reviewCount: 42,
  },
  {
    id: 'w-06',
    name: 'Heavy Cotton Rib Tank',
    category: 'women',
    type: 'T-Shirts',
    price: '$85.00',
    priceNum: 85,
    image: 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=1000&auto=format&fit=crop',
    ],
    colors: [
      { id: 'black', hex: '#000000', name: 'Black' },
      { id: 'white', hex: '#FFFFFF', name: 'White' },
      { id: 'gray', hex: '#9CA3AF', name: 'Heather' },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    description:
      'High-cut racerback silhouette knit from compact 2x1 organic cotton rib with elastane recovery for shape retention.',
    fabric: '95% Supima Cotton, 5% Elastane.',
    fit: 'Fitted cut designed as a foundational layering piece.',
    rating: 4.8,
    reviewCount: 124,
  },

  // ==========================================
  // KIDS' COLLECTION
  // ==========================================
  {
    id: 'k-01',
    name: 'Miniature Boxy Crewneck',
    category: 'kids',
    type: 'T-Shirts',
    price: '$65.00',
    priceNum: 65,
    image: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1471286174890-9c112ffca56a?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=1000&auto=format&fit=crop',
    ],
    status: 'NEW ARRIVAL',
    colors: [
      { id: 'black', hex: '#000000', name: 'Black' },
      { id: 'white', hex: '#FFFFFF', name: 'White' },
      { id: 'slate', hex: '#4B5563', name: 'Slate' },
    ],
    sizes: ['4Y', '6Y', '8Y', '10Y'],
    description:
      'Crafted in buttery-soft 260 GSM organic combed jersey. Features reinforced flatlock seams to prevent irritation and a relaxed silhouette for active movement.',
    fabric: '100% GOTS Certified Organic Cotton.',
    fit: 'Slightly boxy, relaxed kids fit.',
    rating: 4.9,
    reviewCount: 52,
  },
  {
    id: 'k-02',
    name: 'Heavy Fleece Relaxed Sweatpant',
    category: 'kids',
    type: 'Trousers',
    price: '$95.00',
    priceNum: 95,
    image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1471286174890-9c112ffca56a?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1543332164-6e82f355badc?q=80&w=1000&auto=format&fit=crop',
    ],
    colors: [
      { id: 'black', hex: '#000000', name: 'Black' },
      { id: 'gray', hex: '#9CA3AF', name: 'Heather Gray' },
    ],
    sizes: ['4Y', '6Y', '8Y', '10Y', '12Y'],
    description:
      'Dense brushed French terry with an elasticized waistband, bar-tacked pockets, and clean cuffed ankles for everyday play.',
    fabric: '100% Brushed Organic Cotton Fleece (380 GSM).',
    fit: 'Comfortable relaxed fit with generous knee mobility.',
    rating: 4.9,
    reviewCount: 68,
  },
  {
    id: 'k-03',
    name: 'Utility Canvas Chore Jacket',
    category: 'kids',
    type: 'Outerwear',
    price: '$160.00',
    priceNum: 160,
    image: 'https://images.unsplash.com/photo-1471286174890-9c112ffca56a?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1543332164-6e82f355badc?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=1000&auto=format&fit=crop',
    ],
    status: 'NEW ARRIVAL',
    colors: [
      { id: 'charcoal', hex: '#1F2937', name: 'Dark Navy/Charcoal' },
      { id: 'chalk', hex: '#E5E7EB', name: 'Natural Duck' },
    ],
    sizes: ['6Y', '8Y', '10Y'],
    description:
      'Heavy-duty 10oz duck canvas with triple-needle stitch construction, durable tonal enamel snaps, and patch storage pockets.',
    fabric: '100% Washed Cotton Duck Canvas.',
    fit: 'Easy layering chore silhouette with room for sweaters underneath.',
    rating: 4.9,
    reviewCount: 39,
  },
  {
    id: 'k-04',
    name: 'Oversized Minimalist Hoodie',
    category: 'kids',
    type: 'Tops',
    price: '$110.00',
    priceNum: 110,
    image: 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1471286174890-9c112ffca56a?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=1000&auto=format&fit=crop',
    ],
    colors: [
      { id: 'black', hex: '#000000', name: 'Black' },
      { id: 'slate', hex: '#4B5563', name: 'Slate Gray' },
    ],
    sizes: ['4Y', '6Y', '8Y', '10Y', '12Y'],
    description:
      'Clean pull-over silhouette free of dangerous drawcords. Finished with seamless kangaroo pocket and double-needle hems.',
    fabric: '100% Organic Heavy Cotton Fleece (420 GSM).',
    fit: 'Boxy drop-shoulder proportions.',
    rating: 4.9,
    reviewCount: 75,
  },
  {
    id: 'k-05',
    name: 'Structured Denim Overshirt',
    category: 'kids',
    type: 'Outerwear',
    price: '$135.00',
    priceNum: 135,
    image: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1471286174890-9c112ffca56a?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=1000&auto=format&fit=crop',
    ],
    status: 'SOLD OUT',
    colors: [
      { id: 'charcoal', hex: '#1F2937', name: 'Rinse Black' },
      { id: 'black', hex: '#000000', name: 'Overdyed' },
    ],
    sizes: ['6Y', '8Y', '10Y'],
    description:
      'Rigid 11oz black selvedge-look denim softened with a sustainable ozone rinse. Dual chest pockets with concealed snaps.',
    fabric: '100% Regenerative Cotton Denim (11 oz).',
    fit: 'Straight cut overshirt designed to be worn open or closed.',
    rating: 4.8,
    reviewCount: 29,
  },
  {
    id: 'k-06',
    name: 'Washed Ribbed Knit Beanie',
    category: 'kids',
    type: 'Accessories',
    price: '$45.00',
    priceNum: 45,
    image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1471286174890-9c112ffca56a?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?q=80&w=1000&auto=format&fit=crop',
    ],
    colors: [
      { id: 'black', hex: '#000000', name: 'Black' },
      { id: 'white', hex: '#FFFFFF', name: 'Chalk' },
      { id: 'gray', hex: '#9CA3AF', name: 'Heather' },
    ],
    sizes: ['OS'],
    description:
      'Ultra-soft non-scratchy merino wool blend knit with double-layer turn-up cuff and snug shape memory.',
    fabric: '70% Fine Merino Wool, 30% Recycled Cotton.',
    fit: 'One size fits all (Ages 4–12).',
    rating: 4.9,
    reviewCount: 84,
  },
];
