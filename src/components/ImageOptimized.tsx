import React, { useState, useRef } from "react";
import { useLazyImage } from "../hooks/useIntersectionObserver";

interface ImageOptimizedProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: string;
  fallback?: string;
  lazy?: boolean;
  webp?: boolean;
  quality?: number;
  className?: string;
}

/**
 * Optimized image component with lazy loading, WebP support, and fallbacks
 */
export function ImageOptimized({
  src,
  alt,
  placeholder,
  fallback,
  lazy = true,
  webp = true,
  quality = 80,
  className = "",
  ...props
}: ImageOptimizedProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Generate optimized image URLs
  const getOptimizedSrc = (originalSrc: string, useWebP = false) => {
    try {
      const url = new URL(originalSrc, window.location.origin);
      url.searchParams.set("q", quality.toString());
      if (useWebP) {
        url.searchParams.set("f", "webp");
      }
      return url.toString();
    } catch {
      return originalSrc;
    }
  };

  const webpSrc = webp ? getOptimizedSrc(src, true) : null;
  const optimizedSrc = getOptimizedSrc(src);

  // Use lazy loading hook if enabled
  const { src: lazySrc, isLoaded: lazyLoaded } = useLazyImage(
    lazy ? optimizedSrc : "",
    placeholder
  );

  // Determine which src to use
  const finalSrc = lazy ? lazySrc : optimizedSrc;

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  // Show fallback if there's an error and fallback is provided
  if (hasError && fallback) {
    return (
      <img
        ref={imgRef}
        src={fallback}
        alt={alt}
        className={`${className} opacity-75`}
        onLoad={handleLoad}
        {...props}
      />
    );
  }

  return (
    <div className="relative overflow-hidden">
      {/* WebP source if supported */}
      {webpSrc && (
        <picture>
          <source srcSet={webpSrc} type="image/webp" />
          <img
            ref={imgRef}
            src={finalSrc}
            alt={alt}
            className={`
              ${className}
              transition-opacity duration-300
              ${isLoaded ? "opacity-100" : "opacity-0"}
              ${lazy && !lazyLoaded ? "blur-sm" : ""}
            `}
            onLoad={handleLoad}
            onError={handleError}
            loading={lazy ? "lazy" : "eager"}
            decoding="async"
            {...props}
          />
        </picture>
      )}

      {/* Fallback for browsers that don't support picture */}
      {!webpSrc && (
        <img
          ref={imgRef}
          src={finalSrc}
          alt={alt}
          className={`
            ${className}
            transition-opacity duration-300
            ${isLoaded ? "opacity-100" : "opacity-0"}
            ${lazy && !lazyLoaded ? "blur-sm" : ""}
          `}
          onLoad={handleLoad}
          onError={handleError}
          loading={lazy ? "lazy" : "eager"}
          decoding="async"
          {...props}
        />
      )}

      {/* Loading placeholder */}
      {!isLoaded && (
        <div
          className={`
          absolute inset-0 bg-gray-200 animate-pulse
          flex items-center justify-center
        `}
        >
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}

/**
 * Avatar component with optimized loading
 */
export function AvatarOptimized({
  src,
  alt,
  size = 40,
  className = "",
  fallbackInitials,
  ...props
}: {
  src?: string;
  alt: string;
  size?: number;
  className?: string;
  fallbackInitials?: string;
} & Omit<ImageOptimizedProps, "src" | "alt">) {
  if (!src) {
    return (
      <div
        className={`
          ${className}
          flex items-center justify-center
          bg-gradient-to-br from-blue-500 to-purple-600
          text-white font-semibold rounded-full
        `}
        style={{ width: size, height: size }}
      >
        {fallbackInitials || alt.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <ImageOptimized
      src={src}
      alt={alt}
      className={`${className} rounded-full object-cover`}
      style={{ width: size, height: size }}
      {...props}
    />
  );
}

export default ImageOptimized;
