import { useRef } from "react";

import { cn } from "@/utils/cn";

import { useLoadingDotsAnimation } from "./loadingAnimations";
import {
  loadingDotClass,
  loadingDotsTrackClass,
  loadingDotsTrackStyle,
  loadingSpinnerRingClass,
} from "./loadingStyles";
import type { LoadingColor, LoadingSize } from "./loadingTypes";

const LOADING_DOTS_INDICES = [0, 1, 2] as const;

export function LoadingSpinner({
  size,
  color,
  className,
}: {
  size: LoadingSize;
  color: LoadingColor;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={loadingSpinnerRingClass(size, color, className)}
    />
  );
}

export function LoadingDots({
  size,
  color,
  className,
}: {
  size: LoadingSize;
  color: LoadingColor;
  className?: string;
}) {
  const trackRef = useRef<HTMLSpanElement>(null);
  useLoadingDotsAnimation(trackRef, size);

  return (
    <span
      ref={trackRef}
      className={cn(loadingDotsTrackClass(size), className)}
      style={loadingDotsTrackStyle(size)}
      aria-hidden
    >
      {LOADING_DOTS_INDICES.map((index) => (
        <span
          key={index}
          data-loading-dot
          className={loadingDotClass(size, color)}
        />
      ))}
    </span>
  );
}

LoadingDots.displayName = "LoadingDots";
LoadingSpinner.displayName = "LoadingSpinner";
