import {
  useEffect,
  useRef,
  type RefObject,
} from "react";
import {
  createGlassLensRuntime,
  type GlassLensRuntime,
} from "./glassLensOgl";

export type GlassShaderLayerProps = {
  /** 0 — слой скрыт; иначе сила блика по краю (0…1+) */
  intensity: number;
  /**
   * Раньше включало анимацию шейдера; сейчас слой статичный, проп игнорируется
   * (оставлен для совместимости API).
   */
  animated?: boolean;
  containerRef: RefObject<HTMLElement | null>;
  className?: string;
};

/** Слой 2: OGL — нейтральный fresnel-подобный блик только у границ блока. */
export function GlassShaderLayer({
  intensity,
  containerRef,
  className = "",
}: GlassShaderLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const runtimeRef = useRef<GlassLensRuntime | null>(null);
  const intensityRef = useRef(intensity);
  intensityRef.current = intensity;

  const isActive = intensity > 0;

  useEffect(() => {
    if (!isActive) return;

    const canvasEl = canvasRef.current;
    const containerEl = containerRef.current;
    if (!canvasEl || !containerEl) return;

    const rt = createGlassLensRuntime(canvasEl);
    if (!rt) return;
    runtimeRef.current = rt;

    let resizeRaf = 0;

    function syncSize() {
      const root = containerRef.current;
      const r = runtimeRef.current;
      if (!root || !r) return;
      r.resize(root.clientWidth, root.clientHeight);
      r.render(intensityRef.current);
    }

    function scheduleResize() {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(syncSize);
    }

    const ro = new ResizeObserver(scheduleResize);
    ro.observe(containerEl);
    scheduleResize();

    return () => {
      cancelAnimationFrame(resizeRaf);
      ro.disconnect();
      rt.dispose();
      runtimeRef.current = null;
    };
  }, [isActive, containerRef]);

  useEffect(() => {
    if (intensity <= 0) return;
    runtimeRef.current?.render(intensity);
  }, [intensity]);

  if (intensity <= 0) return null;

  return (
    <canvas
      ref={canvasRef}
      className={[
        "pointer-events-none absolute inset-0 z-[1] h-full w-full mix-blend-soft-light",
        className,
      ].join(" ")}
      aria-hidden
    />
  );
}
