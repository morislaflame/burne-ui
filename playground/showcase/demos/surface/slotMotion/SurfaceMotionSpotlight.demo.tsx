import { useLayoutEffect, useRef, type PointerEvent } from "react";
import gsap from "gsap";

import { Surface } from "@/components/core/Surface";
import { Text } from "@/components/core/Text";

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

const QUICK = {
  ease: "power3.out",
  overwrite: "auto" as const,
};

const SPOTLIGHT =
  "radial-gradient(circle calc(var(--space) * 10) at var(--spot-x, 50%) var(--spot-y, 50%), color-mix(in oklab, var(--color-primary) 62%, transparent) 0%, color-mix(in oklab, var(--color-primary) 20%, transparent) 42%, transparent 72%)";

export function SurfaceMotionSpotlightDemo() {
  const surfaceRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const proxyRef = useRef({ x: 0, y: 0 });
  const xToRef = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const yToRef = useRef<ReturnType<typeof gsap.quickTo> | null>(null);

  useLayoutEffect(() => {
    const spot = spotRef.current;
    const surface = surfaceRef.current;
    if (!spot || !surface) return;
    const proxy = proxyRef.current;
    const box = surface.getBoundingClientRect();
    proxy.x = box.width / 2;
    proxy.y = box.height / 2;
    const apply = () => {
      spot.style.setProperty("--spot-x", `${proxy.x}px`);
      spot.style.setProperty("--spot-y", `${proxy.y}px`);
    };
    apply();
    const duration = prefersReducedMotion() ? 0 : 0.4;
    xToRef.current = gsap.quickTo(proxy, "x", { ...QUICK, duration, onUpdate: apply });
    yToRef.current = gsap.quickTo(proxy, "y", { ...QUICK, duration, onUpdate: apply });
    return () => {
      xToRef.current = null;
      yToRef.current = null;
      gsap.killTweensOf(proxy);
    };
  }, []);

  const move = (event: PointerEvent<HTMLDivElement>) => {
    const surface = surfaceRef.current;
    const xTo = xToRef.current;
    const yTo = yToRef.current;
    if (!surface || !xTo || !yTo) return;
    const box = surface.getBoundingClientRect();
    xTo(event.clientX - box.left);
    yTo(event.clientY - box.top);
  };

  const rest = () => {
    const surface = surfaceRef.current;
    if (!surface) return;
    const box = surface.getBoundingClientRect();
    xToRef.current?.(box.width / 2);
    yToRef.current?.(box.height / 2);
  };

  return (
    <Surface
      ref={surfaceRef}
      padding="large"
      shadow="base"
      className="relative isolate min-h-3xlarge overflow-hidden py-3xlarge touch-none"
      onPointerMove={move}
      onPointerLeave={rest}
    >
      <div
        ref={spotRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-mid"
        style={{ backgroundImage: SPOTLIGHT }}
      />
      <div className="relative flex flex-col gap-xsmall">
        <Text variant="base">Spotlight</Text>
        <Text variant="small" className="text-muted">
          Move the pointer — glow follows via CSS vars, not a background tween.
        </Text>
      </div>
    </Surface>
  );
}
