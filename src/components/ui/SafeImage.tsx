import React, { useState } from 'react';
import { ImageSlot } from './ImageSlot';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string;
  fallbackCategory?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt = 'Image NOCIBÉ',
  className = '',
  fallbackTitle,
  fallbackCategory = 'NOCIBÉ BÉNIN',
  loading = 'lazy',
  ...props
}) => {
  const [hasError, setHasError] = useState(!src);

  if (hasError || !src) {
    return (
      <ImageSlot
        title={fallbackTitle || alt}
        category={fallbackCategory}
        className={className}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      onError={() => setHasError(true)}
      draggable={false}
      className={`select-none ${className}`}
      {...props}
    />
  );
};

export default SafeImage;
