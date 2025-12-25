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

const FALLBACK_SVG =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999"%3EImage not available%3C/text%3E%3C/svg%3E';

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
  const [didFallback, setDidFallback] = useState(false);

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
      unoptimized={process.env.NODE_ENV === "development"}
      onError={() => {
        // If the remote image fails/timeouts, switch to a stable inline fallback.
        if (!didFallback) {
          setDidFallback(true);
          setImgSrc(FALLBACK_SVG);
          onError?.();
        }
      }}
    />
  );
}