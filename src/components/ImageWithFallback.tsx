"use client";

import { useState } from "react";
import { Leaf } from "lucide-react";

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackText?: string;
}

export function ImageWithFallback({
  src,
  alt,
  className,
  fallbackText,
  ...props
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex items-center justify-center bg-[#F0F2F5] text-[#9E9E9E] ${className ?? ""}`}
      >
        <div className="flex flex-col items-center gap-2">
          <Leaf className="h-8 w-8" />
          <span className="text-[12px]">{fallbackText ?? alt ?? "Image"}</span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
      {...props}
    />
  );
}
