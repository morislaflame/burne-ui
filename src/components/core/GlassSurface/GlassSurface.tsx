import { useRef, type CSSProperties, type HTMLAttributes } from "react";

import { cn } from "@/utils/cn";
import { GlassBackdrop } from "./GlassBackdrop";

export type GlassSurfaceProps = HTMLAttributes<HTMLDivElement> & {
  /** Классы для внутреннего блока с контентом (слой 3) */
  contentClassName?: string;
  /** Интенсивность OGL-блика по границам блока, 0 = только CSS-стекло */
  refractionIntensity?: number;
  /** Устарело: слой OGL статичный, значение не используется */
  refractionAnimated?: boolean;
};

/**
 * Стекло из трёх слоёв:
 * 1. Линза — tint + backdrop blur + усиление по краю (CSS);
 * 2. OGL — нейтральный fresnel-блик только по контуру блока;
 * 3. Контент.
 */
export function GlassSurface({
  className = "",
  contentClassName = "",
  children,
  refractionIntensity = 1,
  refractionAnimated: _refractionAnimated,
  style,
  ...rest
}: GlassSurfaceProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={rootRef}
      className={cn(
        "relative isolate overflow-hidden rounded-base border shadow-token-sm",
        "border-token/50 bg-transparent",
        className,
      )}
      style={
        {
          borderColor: "var(--glass-border)",
          boxShadow: "0 4px 28px rgb(0 0 0 / 0.18)",
          ...style,
        } as CSSProperties
      }
      {...rest}
    >
      <GlassBackdrop
        containerRef={rootRef}
        refractionIntensity={refractionIntensity}
      />

      <div
        className={cn("relative z-[2] text-foreground", contentClassName)}
      >
        {children}
      </div>
    </div>
  );
}
