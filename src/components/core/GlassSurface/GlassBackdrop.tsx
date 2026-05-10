import { useId, type CSSProperties, type RefObject } from "react";
import { GlassShaderLayer } from "./GlassShaderLayer";

export type GlassBackdropProps = {
  containerRef: RefObject<HTMLElement | null>;
  refractionIntensity?: number;
};

/** Лёгкий шум → смещение пикселей под стеклом (настоящее искажение фона, не WebGL). */
function makeLensBackdropFilter(displaceUrl: string): CSSProperties {
  const chain = `blur(var(--brn-glass-blur)) saturate(var(--brn-glass-saturate)) ${displaceUrl}`;
  return {
    backdropFilter: chain,
    WebkitBackdropFilter: chain,
  };
}

const edgeStyle = {
  backdropFilter:
    "blur(var(--brn-glass-blur-edge)) saturate(var(--brn-glass-saturate))",
  WebkitBackdropFilter:
    "blur(var(--brn-glass-blur-edge)) saturate(var(--brn-glass-saturate))",
  maskImage:
    "radial-gradient(ellipse var(--brn-glass-edge-falloff) var(--brn-glass-edge-falloff) at 50% 50%, transparent 0%, black 100%)",
  WebkitMaskImage:
    "radial-gradient(ellipse var(--brn-glass-edge-falloff) var(--brn-glass-edge-falloff) at 50% 50%, transparent 0%, black 100%)",
} as const;

/** Слои 1–2 стекла: линза + WebGL (контент добавляет обёртка). */
export function GlassBackdrop({
  containerRef,
  refractionIntensity = 1,
}: GlassBackdropProps) {
  const displaceId = `bglass-disp-${useId().replace(/:/g, "")}`;
  const displaceUrl = `url(#${displaceId})`;

  return (
    <>
      <svg
        className="pointer-events-none absolute h-0 w-0 overflow-hidden"
        aria-hidden
      >
        <defs>
          <filter
            id={displaceId}
            x="-30%"
            y="-30%"
            width="160%"
            height="160%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.014"
              numOctaves="2"
              seed="17"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="4"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        <div
          className="absolute inset-0 rounded-[inherit]"
          style={{
            ...makeLensBackdropFilter(displaceUrl),
            background: [
              "linear-gradient(145deg, var(--brn-glass-highlight) 0%, transparent 44%)",
              "linear-gradient(210deg, transparent 52%, color-mix(in srgb, var(--brn-glass-tint-veil) 58%, transparent))",
              "linear-gradient(to bottom, var(--brn-glass-tint), transparent 65%)",
              "var(--brn-glass-tint)",
            ].join(", "),
          }}
        />
        <div className="absolute inset-0 rounded-[inherit]" style={edgeStyle} />
        <div
          className="absolute inset-0 rounded-[inherit] mix-blend-overlay"
          style={
            {
              background:
                "linear-gradient(125deg, var(--brn-glass-highlight) 0%, transparent 38%, transparent 62%, color-mix(in srgb, var(--brn-glass-border) 40%, transparent) 100%)",
              opacity: 0.85,
            } as CSSProperties
          }
        />
      </div>

      <GlassShaderLayer
        intensity={refractionIntensity}
        containerRef={containerRef}
      />
    </>
  );
}
