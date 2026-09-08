interface SilhouetteProps {
  className?: string;
}

/**
 * Solid black silhouette for MEN
 * Precision geometric vector based on classic editorial pictogram
 */
export function SilhouetteMen({ className = 'w-8 sm:w-10 lg:w-12 h-16 sm:h-20 lg:h-24' }: SilhouetteProps) {
  return (
    <svg
      viewBox="0 0 24 56"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      {/* Head */}
      <circle cx="12" cy="6" r="4.2" />
      {/* Torso */}
      <rect x="7.2" y="12" width="9.6" height="19.5" rx="1.5" />
      {/* Left Arm */}
      <rect x="3.8" y="12.8" width="2.6" height="16.5" rx="1.3" />
      {/* Right Arm */}
      <rect x="17.6" y="12.8" width="2.6" height="16.5" rx="1.3" />
      {/* Left Leg */}
      <rect x="7.2" y="30" width="4.2" height="22" rx="1.2" />
      {/* Right Leg */}
      <rect x="12.6" y="30" width="4.2" height="22" rx="1.2" />
    </svg>
  );
}

/**
 * Solid black silhouette for WOMEN
 * Features classic A-line flared dress/skirt silhouette
 */
export function SilhouetteWomen({ className = 'w-8 sm:w-10 lg:w-12 h-16 sm:h-20 lg:h-24' }: SilhouetteProps) {
  return (
    <svg
      viewBox="0 0 24 56"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      {/* Head */}
      <circle cx="12" cy="6" r="4.2" />
      {/* Left Arm */}
      <rect x="3.8" y="12.8" width="2.6" height="15.5" rx="1.3" />
      {/* Right Arm */}
      <rect x="17.6" y="12.8" width="2.6" height="15.5" rx="1.3" />
      {/* Bodice */}
      <rect x="7.6" y="12" width="8.8" height="9" rx="1.5" />
      {/* Flared Skirt / Dress */}
      <polygon points="8,20 16,20 21.2,38 2.8,38" />
      {/* Left Leg */}
      <rect x="8.2" y="37" width="3" height="15" rx="1.2" />
      {/* Right Leg */}
      <rect x="12.8" y="37" width="3" height="15" rx="1.2" />
    </svg>
  );
}

/**
 * Solid black silhouette for KIDS
 * Scaled child proportions aligned to bottom baseline
 */
export function SilhouetteKids({ className = 'w-8 sm:w-10 lg:w-12 h-16 sm:h-20 lg:h-24' }: SilhouetteProps) {
  return (
    <svg
      viewBox="0 0 24 56"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      {/* Head */}
      <circle cx="12" cy="16" r="3.8" />
      {/* Torso */}
      <rect x="8.2" y="21" width="7.6" height="15" rx="1.2" />
      {/* Left Arm */}
      <rect x="5.4" y="21.5" width="2.2" height="12" rx="1" />
      {/* Right Arm */}
      <rect x="16.4" y="21.5" width="2.2" height="12" rx="1" />
      {/* Left Leg */}
      <rect x="8.2" y="35" width="3.2" height="17" rx="1" />
      {/* Right Leg */}
      <rect x="12.6" y="35" width="3.2" height="17" rx="1" />
    </svg>
  );
}
