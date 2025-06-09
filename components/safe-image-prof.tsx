"use client";

import { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";
import { getValidImageSrc } from "@/lib/image-utils";

interface SafeImageProps extends Omit<ImageProps, "src" | "onError"> {
  src: string | undefined | null;
  fallback?: string;
  allowedDomains?: string[];
}

export function SafeImage({
  src,
  alt,
  fallback = "/assets/constants/billboard.png",
  allowedDomains = [],
  ...props
}: SafeImageProps) {
  // Process the image src immediately to prevent external URL fetching
  const [imageSrc] = useState(() => {
    if (!src) return fallback;

    // Check if it's an external URL
    if (src.startsWith("http")) {
      try {
        const url = new URL(src);
        if (allowedDomains.includes(url.hostname)) {
          return src; // Only allow trusted domains
        }
      } catch {
        // Invalid URL
      }
      return fallback; // Block external URLs by default
    }

    return getValidImageSrc(src);
  });

  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError && imageSrc !== fallback) {
      setHasError(true);
      // Force re-render with fallback - but this should rarely happen now
      console.warn(`Image failed to load: ${imageSrc}, using fallback`);
    }
  };

  return (
    <Image
      {...props}
      src={hasError ? fallback : imageSrc}
      alt={alt}
      onError={handleError}
    />
  );
}
