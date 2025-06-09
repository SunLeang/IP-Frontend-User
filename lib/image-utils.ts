// Create a new file: lib/image-utils.ts
export function getValidImageSrc(src: string | undefined | null): string {
  // Default fallback image
  const fallbackImage = "/assets/constants/billboard.png";

  // If no src provided, return fallback
  if (!src) return fallbackImage;

  // If it's already a local path, return as is
  if (src.startsWith("/")) return src;

  // IMPORTANT: For external URLs, return fallback immediately to prevent Next.js from trying to fetch them
  if (src.startsWith("http")) {
    console.warn(`External image URL blocked: ${src}. Using fallback.`);
    return fallbackImage;
  }

  // If it's a relative path, make it absolute
  return `/assets/images/${src}`;
}

// Enhanced version with allowlist for trusted domains
export function getImageSrcWithFallback(
  src: string | undefined | null,
  allowedDomains: string[] = [],
  fallbackImage: string = "/assets/constants/billboard.png"
): string {
  if (!src) return fallbackImage;

  if (src.startsWith("/")) return src;

  if (src.startsWith("http")) {
    try {
      const url = new URL(src);
      // Only allow specific trusted domains
      if (allowedDomains.includes(url.hostname)) {
        return src;
      } else {
        console.warn(
          `Untrusted domain blocked: ${url.hostname}. Using fallback.`
        );
        return fallbackImage;
      }
    } catch {
      console.warn(`Invalid URL: ${src}. Using fallback.`);
      return fallbackImage;
    }
  }

  return `/assets/images/${src}`;
}

// For creating safe image props with client-side error handling
export function createSafeImageProps(
  src: string | undefined | null,
  alt: string,
  allowedDomains: string[] = []
) {
  const safeSrc = getImageSrcWithFallback(src, allowedDomains);
  const fallback = "/assets/constants/billboard.png";

  return {
    src: safeSrc,
    alt,
    onError: (e: any) => {
      // Only set fallback if current src is not already the fallback
      if (e.target.src !== fallback) {
        e.target.src = fallback;
      }
    },
  };
}
