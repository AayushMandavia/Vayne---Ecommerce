<div align="center">

  <img src="public/favicon.png" width="96" height="96" alt="VAYNE Logo" style="border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.15);" />

  # V A Y N E
  ### Editorial Haute Couture & Modern Streetwear Experience

  [![Vercel Deployment](https://img.shields.io/badge/Deployed%20with-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
  [![React 19](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
  [![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

  <p align="center">
    <strong>A luxury digital flagship combining editorial fashion aesthetics, choreographed 3D model physics, and instantaneous tiered image preloading.</strong>
  </p>

  [Explore Live Demo](https://vayne-store.netlify.app) • [View Releases](https://github.com/AayushMandavia/Vayne---Ecommerce/commits/main) • [Report Bug](https://github.com/AayushMandavia/Vayne---Ecommerce/issues)

</div>

---

## ✦ Brand Philosophy & Vision

**VAYNE** re-imagines digital fashion commerce away from generic e-commerce templates into an immersive high-fashion editorial runway. Built with bespoke micro-interactions, bold Swiss-inspired typography, and fluid spring physics, every interaction feels alive and intentional.

---

## ✦ Core Architectural Highlights

### 1. Choreographed 3D Rotating Model Carousel
- **Perspective Physics**: Real-time calculated depth scaling, dynamic z-indexing, Gaussian blur falloff, and fluid spring animations.
- **Dynamic Chromatic Backgrounds**: Ambient background glow transitions tailored to each drop's signature palette (ruby crimson, desert sand, pitch noir, powder blue, and olive military).
- **Navigation Controls**: Keyboard arrow navigation, continuous scroll wheel detection, drag/swipe gestures, and instant random drop shuffle.

### 2. Double-Preloader Architecture
- **Initial Editorial Preloader**: Luxury typography display with custom 4-dot baseline trailing animation.
- **Tiered Asynchronous Image Preloading**: Proactively caches assets in 4 sequential priority rings:
  1. *Tier 1*: 9 High-Resolution Landing Carousel Models
  2. *Tier 2*: 8 Square Lookbook Collage Photos
  3. *Tier 3*: 54 Primary Product Catalog Cards
  4. *Tier 4*: 150+ High-Resolution Product Detail Galleries
- **Shop Transition Collage**: An 8-image choreographed lookbook that pops in upon entering the store, cross-fading directly into the department selector without intermediate layout shifts.

### 3. Bespoke Fashion Silhouettes
- Custom-tailored department signage:
  - **Men**: Posed model silhouette in a trenchcoat and fedora hat.
  - **Women**: Sculptural couture model silhouette in an asymmetrical cocktail dress.
  - **Kids**: Duo child silhouette facing each other (boy in fedora & girl in dress).
- Integrated with micro-hover interactions that glide fluidly on cursor proximity.

### 4. Full-Featured Commerce Flow
- **Curated Catalog**: 54 hand-curated high-fashion items (heavyweight drop-shoulder graphic tees, 420 GSM french terry streetwear hoodies, wide-leg utility cargos, structured corset tops, and tailored boyfriend blazers).
- **Slide-Over Cart Drawer**: Real-time quantity management, subtotal calculations, dynamic free-shipping progress indicators, and cross-sell recommendations.
- **Client VIP Account Drawer**: Integrated luxury loyalty portal with order status, saved addresses, and concierge perks.
- **Frictionless Checkout**: Multi-step checkout experience with validation and immediate order confirmation.

---

## ✦ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Build Tool** | [Vite 8](https://vitejs.dev/) with Rolldown / SWC |
| **Styling & Design** | [Vanilla CSS Tokens](https://developer.mozilla.org/en-US/docs/Web/CSS) + [Tailwind CSS 3](https://tailwindcss.com/) |
| **Typography** | [Anton](https://fonts.google.com/specimen/Anton), [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans), [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) |
| **Icons & Vectors** | [Lucide React](https://lucide.dev/) + Custom SVG Vector System |
| **Deployment Platform** | [Vercel](https://vercel.com/) (Native CI/CD with `vercel.json` SPA Routing) |

---

## ✦ Directory Structure

```
├── public/
│   ├── favicons/              # High-resolution favicon options and showcase
│   ├── silhouettes/           # Custom fashion silhouettes (Men, Women, Kids)
│   ├── shop-preloader/        # 8 Lookbook transition editorial photos
│   ├── landing/               # 9 High-res 3D carousel cutouts
│   ├── favicon.png            # Active high-res master favicon
│   ├── favicon.ico            # Multi-size ICO (16/32/48/64)
│   └── apple-touch-icon.png   # iOS home screen web-clip icon
├── src/
│   ├── App.tsx                # Main runway, carousel physics & flow orchestrator
│   ├── Preloader.tsx          # Editorial baseline dots preloader & 4-tier image loader
│   ├── ShopPreloader.tsx      # Lookbook collage transition screen
│   ├── CategorySilhouettes.tsx# Custom silhouette components (Men, Women, Kids)
│   ├── CollectionCatalog.tsx  # Filterable product gallery with live search
│   ├── ProductDetail.tsx      # Comprehensive PDP modal with multi-angle gallery
│   ├── CartDrawer.tsx         # Slide-over cart with recommendations
│   ├── Checkout.tsx           # Multi-step checkout & payment flow
│   ├── AccountModal.tsx       # VIP client account & loyalty portal
│   └── data.ts                # 54 curated fashion products, specifications & specs
├── vercel.json                # Vercel deployment, SPA rewrites & asset caching headers
├── package.json               # Dependencies & scripts
└── tailwind.config.js         # Custom palette, typography & animations
```

---

## ✦ Getting Started Locally

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn or pnpm

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/AayushMandavia/Vayne---Ecommerce.git
   cd Vayne---Ecommerce
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start local development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` to view the live runway experience.

4. **Compile production build**:
   ```bash
   npm run build
   ```

---

## ✦ Deployment to Vercel

This repository is optimized for [Vercel](https://vercel.com) out of the box with zero additional configuration needed:

1. Import the repository `AayushMandavia/Vayne---Ecommerce` in your **Vercel Dashboard**.
2. Vercel automatically detects `vercel.json` for:
   - Framework: **Vite**
   - Output Directory: **`dist`**
   - Client-side rewrites to `/index.html`
3. Every commit to `main` triggers a production deployment with edge-cached global distribution.

---

## ✦ License

Crafted with care by [Aayush Mandavia](https://github.com/AayushMandavia). All rights reserved.
