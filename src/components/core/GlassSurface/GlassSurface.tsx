import { useRef, type CSSProperties, type HTMLAttributes } from "react";
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
      className={[
        "relative isolate overflow-hidden rounded-b-md border shadow-sm",
        "border-b-border/50 bg-transparent",
        className,
      ].join(" ")}
      style={
        {
          borderColor: "var(--b-glass-border)",
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
        className={["relative z-[2] text-b-text", contentClassName].join(" ")}
      >
        {children}
      </div>
    </div>
  );
}
