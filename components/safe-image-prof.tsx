"use client";

import Image from "next/image";
import { useState } from "react";
import { getValidImageSrc } from "@/lib/image-utils";

interface SafeImageProps {
  src: string | null | undefined;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallback?: string;
}

export function SafeImage({
  src,
  alt,
  width = 300,
  height = 200,
  className = "",
  fallback = "/assets/constants/billboard.png",
}: SafeImageProps) {
  const [imageSrc, setImageSrc] = useState(getValidImageSrc(src, fallback));
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError && imageSrc !== fallback) {
      console.warn(`Image failed to load: ${imageSrc}, using fallback`);
      setImageSrc(fallback);
      setHasError(true);
    }
  };

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={handleError}
    />
  );
}
