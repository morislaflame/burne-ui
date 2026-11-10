import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

import { CloseButton } from "@/components/core/CloseButton";

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

const DRAW = {
  overwrite: true as const,
  ease: "power2.inOut",
};

const SQUEEZE = {
  overwrite: "auto" as const,
  ease: "power2.out",
  force3D: false,
};

export function CloseButtonMotionDrawXDemo() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const firstRef = useRef<SVGPathElement>(null);
  const secondRef = useRef<SVGPathElement>(null);
  const drawTlRef = useRef<gsap.core.Timeline | null>(null);

  const strokePaths = () =>
    [firstRef.current, secondRef.current].filter(
      (node): node is SVGPathElement => node != null,
    );

  const killDraw = () => {
    drawTlRef.current?.kill();
    drawTlRef.current = null;
    gsap.killTweensOf(strokePaths());
  };

  useLayoutEffect(() => {
    gsap.registerPlugin(DrawSVGPlugin);
    const lines = strokePaths();
    if (lines.length === 0) return;
    gsap.set(lines, { drawSVG: "100%" });
    return () => {
      drawTlRef.current?.kill();
      drawTlRef.current = null;
      gsap.killTweensOf(lines);
      gsap.set(lines, { clearProps: "strokeDasharray,strokeDashoffset" });
      const wrap = wrapRef.current;
      if (wrap) {
        gsap.killTweensOf(wrap);
        gsap.set(wrap, { scale: 1, force3D: false });
      }
    };
  }, []);

  const draw = () => {
    const lines = strokePaths();
    if (lines.length < 2) return;
    killDraw();
    if (prefersReducedMotion()) {
      gsap.set(lines, { drawSVG: "100%" });
      return;
    }
    const tl = gsap.timeline({ defaults: DRAW });
    drawTlRef.current = tl;
    tl.fromTo(lines[0], { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.42 }, 0);
    tl.fromTo(lines[1], { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.42 }, 0.12);
  };

  const restDraw = () => {
    const lines = strokePaths();
    killDraw();
    if (lines.length === 0) return;
    gsap.to(lines, {
      ...DRAW,
      drawSVG: "100%",
      duration: prefersReducedMotion() ? 0 : 0.18,
    });
  };

  const squeeze = () => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    gsap.to(wrap, {
      ...SQUEEZE,
      scale: prefersReducedMotion() ? 1 : 0.98,
      duration: prefersReducedMotion() ? 0 : 0.12,
    });
  };

  const unsqueeze = () => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    gsap.to(wrap, {
      ...SQUEEZE,
      scale: 1,
      duration: prefersReducedMotion() ? 0 : 0.16,
    });
  };

  return (
    <div
      ref={wrapRef}
      className="relative inline-flex text-foreground"
      onPointerEnter={draw}
      onPointerLeave={() => {
        restDraw();
        unsqueeze();
      }}
      onPointerDown={squeeze}
      onPointerUp={unsqueeze}
      onPointerCancel={unsqueeze}
    >
      <CloseButton
        aria-label="DrawSVG close"
        classNames={{ icon: "opacity-0" }}
        motion={{
          root: { hoverIn: false, hoverOut: false, pressIn: false },
        }}
      />
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
        <svg className="icon-base" viewBox="0 0 24 24" fill="none">
          <path
            ref={firstRef}
            d="M7 7 L17 17"
            stroke="currentColor"
            strokeWidth="2.25"
            strokeLinecap="round"
          />
          <path
            ref={secondRef}
            d="M17 7 L7 17"
            stroke="currentColor"
            strokeWidth="2.25"
            strokeLinecap="round"
          />
        </svg>
      </span>
    </div>
  );
}
