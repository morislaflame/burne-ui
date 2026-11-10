import { useLayoutEffect, useRef, type PointerEvent } from "react";
import gsap from "gsap";

import { Button } from "@/components/core/Button";

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

const QUICK = {
  ease: "power3.out",
  overwrite: "auto" as const,
  force3D: false,
};

const MAX_PULL = 22;
const INFLUENCE = 140;

function magnetDelta(el: HTMLElement, clientX: number, clientY: number) {
  const x = Number(gsap.getProperty(el, "x")) || 0;
  const y = Number(gsap.getProperty(el, "y")) || 0;
  const box = el.getBoundingClientRect();
  const restX = box.left + box.width / 2 - x;
  const restY = box.top + box.height / 2 - y;
  const dx = clientX - restX;
  const dy = clientY - restY;
  const dist = Math.hypot(dx, dy) || 1;
  const pull = MAX_PULL * Math.max(0, 1 - dist / INFLUENCE);
  return { x: (dx / dist) * pull, y: (dy / dist) * pull };
}

export function ButtonMotionMagnetDemo() {
  const magnetRef = useRef<HTMLDivElement>(null);
  const xToRef = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const yToRef = useRef<ReturnType<typeof gsap.quickTo> | null>(null);

  useLayoutEffect(() => {
    const magnet = magnetRef.current;
    if (!magnet) return;
    const duration = prefersReducedMotion() ? 0 : 0.4;
    xToRef.current = gsap.quickTo(magnet, "x", { ...QUICK, duration });
    yToRef.current = gsap.quickTo(magnet, "y", { ...QUICK, duration });
    return () => {
      xToRef.current = null;
      yToRef.current = null;
      gsap.killTweensOf(magnet);
      gsap.set(magnet, { x: 0, y: 0, force3D: false });
    };
  }, []);

  const rest = () => {
    xToRef.current?.(0);
    yToRef.current?.(0);
  };

  const pull = (event: PointerEvent<HTMLDivElement>) => {
    const magnet = magnetRef.current;
    const xTo = xToRef.current;
    const yTo = yToRef.current;
    if (!magnet || !xTo || !yTo) return;
    const next = magnetDelta(magnet, event.clientX, event.clientY);
    xTo(next.x);
    yTo(next.y);
  };

  return (
    <div
      className="flex items-center justify-center rounded-large border-token bg-muted/40 p-3xlarge touch-none"
      onPointerMove={pull}
      onPointerLeave={rest}
    >
      <div ref={magnetRef} className="inline-flex">
        <Button variant="primary">Magnet</Button>
      </div>
    </div>
  );
}
