import { useLayoutEffect, useRef, type PointerEvent } from "react";
import gsap from "gsap";

import { Card } from "@/components/core/Card";

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

export function CardMotionMouseFollowDemo() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLElement>(null);
  const xToRef = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const yToRef = useRef<ReturnType<typeof gsap.quickTo> | null>(null);

  useLayoutEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const duration = prefersReducedMotion() ? 0 : 0.45;
    xToRef.current = gsap.quickTo(card, "x", { ...QUICK, duration });
    yToRef.current = gsap.quickTo(card, "y", { ...QUICK, duration });
    return () => {
      xToRef.current = null;
      yToRef.current = null;
      gsap.killTweensOf(card);
      gsap.set(card, { x: 0, y: 0, force3D: false });
    };
  }, []);

  const rest = () => {
    xToRef.current?.(0);
    yToRef.current?.(0);
  };

  const follow = (event: PointerEvent<HTMLDivElement>) => {
    const wrap = wrapRef.current;
    const xTo = xToRef.current;
    const yTo = yToRef.current;
    if (!wrap || !xTo || !yTo) return;
    const box = wrap.getBoundingClientRect();
    const px = (event.clientX - box.left) / box.width - 0.5;
    const py = (event.clientY - box.top) / box.height - 0.5;
    xTo(px * 28);
    yTo(py * 18);
  };

  return (
    <div
      ref={wrapRef}
      className="flex justify-center rounded-large border-token bg-muted/40 p-3xlarge touch-none"
      onPointerMove={follow}
      onPointerLeave={rest}
    >
      <Card ref={cardRef} variant="outline" className="max-w-component-mid w-full">
        <Card.Header>
          <Card.Title>Mouse follow</Card.Title>
          <Card.Description>
            Pad pointer → GSAP quickTo on x/y. Not slot hoverIn, not a MotionRun.
          </Card.Description>
        </Card.Header>
      </Card>
    </div>
  );
}
