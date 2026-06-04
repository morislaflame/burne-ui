import { useRef, type CSSProperties, type HTMLAttributes } from "react";

import { cn } from "@/utils/cn";
import {
  useLiquidGlass,
  type LiquidGlassControls,
  type LiquidGlassShape,
} from "./useLiquidGlass";

export type { LiquidGlassShape, LiquidGlassControls };

export type LiquidGlassProps = HTMLAttributes<HTMLDivElement> &
  LiquidGlassControls & {
    /**
     * Shape of the glass element.
     * @default "rounded"
     */
    shape?: LiquidGlassShape;
    /**
     * Override border-radius in pixels. Computed automatically for `circle` and `pill` if omitted.
     */
    borderRadius?: number;
    /** CSS selector pattern for DOM elements to hide from the page capture */
    ignoreSelector?: string;
    /** Class applied to the inner content wrapper */
    contentClassName?: string;
  };

/**
 * Apple-style Liquid Glass component.
 *
 * Uses WebGL to sample the underlying page content, apply refraction distortion,
 * Gaussian blur, and tint — creating the liquid glass effect from Apple's design language.
 *
 * The component captures a static snapshot of the page on mount via html2canvas.
 * The snapshot is shared across all `LiquidGlass` instances to minimise overhead.
 */
export function LiquidGlass({
  className,
  contentClassName,
  children,
  style,
  shape = "rounded",
  borderRadius,
  ignoreSelector,
  edgeIntensity,
  rimIntensity,
  baseIntensity,
  edgeDistance,
  rimDistance,
  baseDistance,
  cornerBoost,
  rippleEffect,
  blurRadius,
  tintOpacity,
  warp,
  ...rest
}: LiquidGlassProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useLiquidGlass(canvasRef, containerRef, {
    shape,
    borderRadius,
    ignoreSelector,
    edgeIntensity,
    rimIntensity,
    baseIntensity,
    edgeDistance,
    rimDistance,
    baseDistance,
    cornerBoost,
    rippleEffect,
    blurRadius,
    tintOpacity,
    warp,
  });

  const shapeStyles: CSSProperties =
    shape === "circle"
      ? { aspectRatio: "1 / 1", flexShrink: 0 }
      : shape === "pill"
        ? { flexShrink: 0 }
        : {};

  return (
    <div
      ref={containerRef}
      className={cn(
        "liquid-glass-root relative box-border flex items-center justify-center overflow-hidden",
        className,
      )}
      style={{
        borderRadius:
          borderRadius !== undefined
            ? borderRadius
            : shape === "pill"
              ? "9999px"
              : shape === "circle"
                ? "50%"
                : "var(--radius-base, 1.5rem)",
        ...shapeStyles,
        ...style,
      }}
      {...rest}
    >
      <canvas
        ref={canvasRef}
        className="liquid-glass-canvas pointer-events-none absolute inset-0 h-full w-full"
        style={{
          zIndex: 0,
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.25)",
          borderRadius: "inherit",
        }}
      />
      <div
        className={cn(
          "relative z-[1] flex items-center justify-center",
          contentClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}
