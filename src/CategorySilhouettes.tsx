interface SilhouetteProps {
  className?: string;
}

/**
 * Custom Bespoke Fashion Silhouette for MEN
 * Posed model wearing fedora hat and tailored trenchcoat
 */
export function SilhouetteMen({ className = 'h-14 sm:h-20 lg:h-24 w-auto max-w-[60px] sm:max-w-[85px] lg:max-w-[100px]' }: SilhouetteProps) {
  return (
    <img
      src="/silhouettes/men.png"
      alt="Men Silhouette"
      draggable={false}
      className={`object-contain select-none pointer-events-none ${className}`}
    />
  );
}

/**
 * Custom Bespoke Fashion Silhouette for WOMEN
 * Sculptural couture model silhouette in cocktail dress
 */
export function SilhouetteWomen({ className = 'h-14 sm:h-20 lg:h-24 w-auto max-w-[50px] sm:max-w-[70px] lg:max-w-[85px]' }: SilhouetteProps) {
  return (
    <img
      src="/silhouettes/women.png"
      alt="Women Silhouette"
      draggable={false}
      className={`object-contain select-none pointer-events-none ${className}`}
    />
  );
}

/**
 * Custom Bespoke Fashion Silhouette for KIDS
 * Stylized duo silhouette of boy and girl facing each other
 */
export function SilhouetteKids({ className = 'h-14 sm:h-20 lg:h-24 w-auto max-w-[85px] sm:max-w-[120px] lg:max-w-[145px]' }: SilhouetteProps) {
  return (
    <img
      src="/silhouettes/kids.png"
      alt="Kids Silhouette"
      draggable={false}
      className={`object-contain select-none pointer-events-none ${className}`}
    />
  );
}
