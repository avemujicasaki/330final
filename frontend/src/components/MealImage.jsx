import React, { useState } from 'react';
import { Utensils } from 'lucide-react';

const FALLBACK = '/images/meals/green-curry.jpg';

/** Bust cache when meal photos are replaced (bump after image updates). */
const IMG_VERSION = '2';

export default function MealImage({ src, alt, className = '' }) {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className={`meal-image-fallback ${className}`} aria-label={alt}>
        <Utensils size={32} />
        <span>{alt}</span>
      </div>
    );
  }

  const srcWithCache =
    src && src.startsWith('/images/') ? `${src}${src.includes('?') ? '&' : '?'}v=${IMG_VERSION}` : src;

  return (
    <img
      src={srcWithCache}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setError(true)}
    />
  );
}

export { FALLBACK };
