/**
 * Image utility functions
 * Helper functions for handling image sources and validation
 */

/**
 * Gets a valid image source with fallback only when needed
 * @param src - Image source URL (can be null, undefined, or empty)
 * @param fallback - Fallback image path
 * @returns Valid image URL or fallback only if src is invalid
 */
export function getValidImageSrc(
  src: string | null | undefined,
  fallback: string = "/assets/constants/billboard.png"
): string {
  // Only use fallback if src is truly invalid
  if (!src || src.trim() === "" || src === "null" || src === "undefined") {
    return fallback;
  }

  // Handle relative paths without leading slash - Next.js requires leading slash
  if (
    src &&
    !src.startsWith("/") &&
    !src.startsWith("http") &&
    !src.startsWith("data:")
  ) {
    console.log(`Fixing relative path: ${src} -> /${src}`);
    return `/${src}`;
  }

  // Return the actual image path from API
  return src;
}

/**
 * Enhanced version with allowlist for trusted domains (for external URLs)
 * @param src - Image source URL
 * @param allowedDomains - Array of allowed domain names
 * @param fallback - Fallback image path
 * @returns Valid image URL
 */
export function getImageSrcWithFallback(
  src: string | undefined | null,
  allowedDomains: string[] = [],
  fallback: string = "/assets/constants/billboard.png"
): string {
  if (!src || src.trim() === "" || src === "null" || src === "undefined") {
    return fallback;
  }

  // If it's a local path (starts with /), use it directly
  if (src.startsWith("/")) {
    return src;
  }

  // Handle relative paths - add leading slash
  if (!src.startsWith("http") && !src.startsWith("data:")) {
    return `/${src}`;
  }

  // Handle external URLs
  if (src.startsWith("http")) {
    try {
      const url = new URL(src);
      // Only allow specific trusted domains
      if (
        allowedDomains.length === 0 ||
        allowedDomains.includes(url.hostname)
      ) {
        return src;
      } else {
        console.warn(
          `Untrusted domain blocked: ${url.hostname}. Using fallback.`
        );
        return fallback;
      }
    } catch {
      console.warn(`Invalid URL: ${src}. Using fallback.`);
      return fallback;
    }
  }

  // For relative paths from API, use them as-is with leading slash
  return src;
}

/**
 * For creating safe image props with client-side error handling
 * @param src - Image source from API
 * @param alt - Alt text for image
 * @param allowedDomains - Allowed external domains
 * @returns Safe image props object
 */
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
      if (
        e.target.src !== fallback &&
        e.target.src !== window.location.origin + fallback
      ) {
        console.warn(`Image failed to load: ${e.target.src}, using fallback`);
        e.target.src = fallback;
      }
    },
  };
}
