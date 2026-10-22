import React from "react";
import { cn } from "../../lib/utils";

export interface ResponsiveImageProps {
  desktopSrc: string;
  mobileSrc?: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  width?: number | string;
  height?: number | string;
  priority?: boolean;
  sizes?: string;
  fallbackSrc?: string;
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  desktopSrc,
  mobileSrc,
  alt,
  className,
  imageClassName,
  width,
  height,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 1200px",
  fallbackSrc,
}) => {
  return (
    <picture className={cn("inline-block overflow-hidden", className)}>
      {mobileSrc && (
        <source
          media="(max-width: 767px)"
          srcSet={mobileSrc}
          sizes={sizes}
        />
      )}
      <source
        media="(min-width: 768px)"
        srcSet={desktopSrc}
        sizes={sizes}
      />
      <img
        src={desktopSrc}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          imageClassName
        )}
        onError={(e) => {
          if (fallbackSrc) {
            (e.target as HTMLImageElement).src = fallbackSrc;
          }
        }}
      />
    </picture>
  );
};

export default ResponsiveImage;

