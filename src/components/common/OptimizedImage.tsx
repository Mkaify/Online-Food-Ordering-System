"use client";

import Image from "next/image";
import { useState } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  onError?: () => void;
}

export default function OptimizedImage({
  src,
  alt,
  fill,
  width,
  height,
  className,
  priority,
  sizes,
  onError,
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      // Fallback to a placeholder image or the original src without optimization
      setImgSrc(src);
      onError?.();
    }
  };

  // If error occurred, use regular img tag as fallback
  if (hasError) {
    return (
      <img
        src={imgSrc}
        alt={alt}
        className={className}
        style={fill ? { width: '100%', height: '100%', objectFit: 'cover' } : undefined}
        onError={() => {
          // Final fallback to a placeholder
          setImgSrc('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999"%3EImage not available%3C/text%3E%3C/svg%3E');
        }}
      />
    );
  }

  try {
    return (
      <Image
        src={imgSrc}
        alt={alt}
        fill={fill}
        width={width}
        height={height}
        className={className}
        priority={priority}
        sizes={sizes}
        onError={handleError}
        unoptimized={process.env.NODE_ENV === 'development'}
      />
    );
  } catch (error) {
    // Fallback to regular img tag if Image component fails
    return (
      <img
        src={imgSrc}
        alt={alt}
        className={className}
        style={fill ? { width: '100%', height: '100%', objectFit: 'cover' } : undefined}
      />
    );
  }
}

