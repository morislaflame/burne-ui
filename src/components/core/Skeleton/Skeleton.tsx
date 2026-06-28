import {
  forwardRef,
  type CSSProperties,
  type HTMLAttributes,
} from "react";

import { cn } from "@/utils/cn";


export type SkeletonVariant = "pulse" | "wave" | "shimmer" | "none";

export type SkeletonRadius = "none" | "small" | "mid" | "full";

export type SkeletonProps = HTMLAttributes<HTMLDivElement> & {
  variant?: SkeletonVariant;
  radius?: SkeletonRadius;
};

export type SkeletonCircleProps = HTMLAttributes<HTMLDivElement> & {
  variant?: SkeletonVariant;
  size?: string;
};

export type SkeletonTextProps = HTMLAttributes<HTMLDivElement> & {
  variant?: SkeletonVariant;
  lines?: number;
  lastShort?: boolean;
};


const RADIUS_CLASS: Record<SkeletonRadius, string> = {
  none:  "rounded-none",
  small: "rounded-small",
  mid:   "rounded-mid",
  full:  "rounded-full",
};

const BASE_CLS = "relative overflow-hidden bg-primary-tint";


function pulseStyle(): CSSProperties {
  return {
    animation: "skeleton-pulse 1.6s ease-in-out infinite",
  };
}

function waveChild(): React.ReactNode {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 -translate-x-full"
      style={{
        animation: "skeleton-wave-slide 2s linear 0.2s infinite",
        background:
          "linear-gradient(90deg, transparent 0%, var(--color-primary-tint-strong) 50%, transparent 100%)",
      }}
    />
  );
}

function shimmerStyle(): CSSProperties {
  return {
    backgroundImage:
      "linear-gradient(90deg, var(--color-primary-tint) 0%, var(--color-primary-tint-strong) 50%, var(--color-primary-tint) 100%)",
    backgroundSize: "400% 100%",
    animation: "skeleton-shimmer 2s linear infinite",
  };
}

function variantStyle(variant: SkeletonVariant): CSSProperties {
  if (variant === "pulse")   return pulseStyle();
  if (variant === "shimmer") return shimmerStyle();
  return {};
}


export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  function Skeleton(
    { variant = "wave", radius = "small", className = "", style, children, ...rest },
    ref,
  ) {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        role="presentation"
        className={cn(BASE_CLS, RADIUS_CLASS[radius], className)}
        style={{ ...variantStyle(variant), ...style }}
        {...rest}
      >
        {variant === "wave" ? waveChild() : null}
        {children}
      </div>
    );
  },
);

Skeleton.displayName = "Skeleton";


export const SkeletonCircle = forwardRef<HTMLDivElement, SkeletonCircleProps>(
  function SkeletonCircle(
    { variant = "wave", size = "h-control-base w-control-base", className = "", style, ...rest },
    ref,
  ) {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        role="presentation"
        className={cn(BASE_CLS, "rounded-full", size, className)}
        style={{ ...variantStyle(variant), ...style }}
        {...rest}
      >
        {variant === "wave" ? waveChild() : null}
      </div>
    );
  },
);

SkeletonCircle.displayName = "SkeletonCircle";


export const SkeletonText = forwardRef<HTMLDivElement, SkeletonTextProps>(
  function SkeletonText(
    {
      variant = "wave",
      lines = 3,
      lastShort = true,
      className = "",
      style,
      ...rest
    },
    ref,
  ) {
    const lineWidths = Array.from({ length: lines }, (_, i) => {
      if (lastShort && i === lines - 1) return "w-3/5";
      return "w-full";
    });

    return (
      <div
        ref={ref}
        aria-hidden="true"
        role="presentation"
        className={cn("flex flex-col gap-small", className)}
        style={style}
        {...rest}
      >
        {lineWidths.map((w, i) => (
          <div
            key={i}
            className={cn(BASE_CLS, "h-[1em] rounded-small", w)}
            style={{
              ...variantStyle(variant),
              animationDelay: `${i * 0.06}s`,
            }}
          >
            {variant === "wave" ? waveChild() : null}
          </div>
        ))}
      </div>
    );
  },
);

SkeletonText.displayName = "SkeletonText";


export const SkeletonBlock = forwardRef<HTMLDivElement, SkeletonProps>(
  function SkeletonBlock(
    { variant = "wave", className = "", style, children, ...rest },
    ref,
  ) {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        role="presentation"
        className={cn(
          BASE_CLS,
          "rounded-mid px-mid py-plus",
          className,
        )}
        style={{ ...variantStyle(variant), ...style }}
        {...rest}
      >
        {variant === "wave" ? waveChild() : null}
        {children}
      </div>
    );
  },
);

SkeletonBlock.displayName = "SkeletonBlock";