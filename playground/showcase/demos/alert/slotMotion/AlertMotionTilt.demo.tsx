import { useLayoutEffect, useRef, type PointerEvent } from "react";
import gsap from "gsap";

import { Alert } from "@/components/core/Alert";

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

export function AlertMotionTiltDemo() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const alertRef = useRef<HTMLDivElement>(null);
  const rxToRef = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const ryToRef = useRef<ReturnType<typeof gsap.quickTo> | null>(null);

  useLayoutEffect(() => {
    const alert = alertRef.current;
    if (!alert) return;
    gsap.set(alert, { transformPerspective: 900, force3D: false });
    const duration = prefersReducedMotion() ? 0 : 0.4;
    rxToRef.current = gsap.quickTo(alert, "rotationX", { ...QUICK, duration });
    ryToRef.current = gsap.quickTo(alert, "rotationY", { ...QUICK, duration });
    return () => {
      rxToRef.current = null;
      ryToRef.current = null;
      gsap.killTweensOf(alert);
      gsap.set(alert, { rotationX: 0, rotationY: 0, clearProps: "transform", force3D: false });
    };
  }, []);

  const rest = () => {
    rxToRef.current?.(0);
    ryToRef.current?.(0);
  };

  const tilt = (event: PointerEvent<HTMLDivElement>) => {
    const wrap = wrapRef.current;
    const rxTo = rxToRef.current;
    const ryTo = ryToRef.current;
    if (!wrap || !rxTo || !ryTo) return;
    const box = wrap.getBoundingClientRect();
    const px = (event.clientX - box.left) / box.width - 0.5;
    const py = (event.clientY - box.top) / box.height - 0.5;
    rxTo(-py * 14);
    ryTo(px * 18);
  };

  return (
    <div
      ref={wrapRef}
      className="rounded-large border-token bg-muted/40 p-xlarge touch-none"
      style={{ perspective: "900px" }}
      onPointerMove={tilt}
      onPointerLeave={rest}
    >
      <Alert
        ref={alertRef}
        hoverLift={false}
        status="info"
        title="Tilt"
        description="Pointer maps to rotationX / rotationY via quickTo — kit hoverLift is off."
      />
    </div>
  );
}
