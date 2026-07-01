import { forwardRef } from "react";

import { cn } from "@/utils/cn";

import { LoadingDots, LoadingSpinner } from "./loadingParts";
import { LOADING_ROOT_CLASS } from "./loadingStyles";
import type { LoadingProps } from "./loadingTypes";

export type {
  LoadingColor,
  LoadingProps,
  LoadingSize,
  LoadingVariant,
} from "./loadingTypes";

export const Loading = forwardRef<HTMLSpanElement, LoadingProps>(function Loading(
  {
    variant = "spinner",
    size = "base",
    color = "primary",
    label = "Loading",
    className = "",
    ...rest
  },
  ref,
) {
  return (
    <span
      ref={ref}
      role="status"
      aria-live="polite"
      aria-label={label}
      className={cn(LOADING_ROOT_CLASS, className)}
      {...rest}
    >
      {variant === "dots" ? (
        <LoadingDots size={size} color={color} />
      ) : (
        <LoadingSpinner size={size} color={color} />
      )}
    </span>
  );
});

Loading.displayName = "Loading";
