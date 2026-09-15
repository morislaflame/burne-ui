import { useLayoutEffect, useRef, type PointerEvent } from "react";
import gsap from "gsap";

import { Avatar } from "@/components/core/Avatar";
import { PIN_IMAGE1, PIN_IMAGE2, PIN_IMAGE3 } from "@/stories-utils/mockImages";

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

const MAX_PULL = 16;
const INFLUENCE = 160;

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

export function AvatarMotionMagnetDemo() {
  const oneRef = useRef<HTMLDivElement>(null);
  const twoRef = useRef<HTMLDivElement>(null);
  const threeRef = useRef<HTMLDivElement>(null);
  const xTosRef = useRef<Array<ReturnType<typeof gsap.quickTo>>>([]);
  const yTosRef = useRef<Array<ReturnType<typeof gsap.quickTo>>>([]);

  useLayoutEffect(() => {
    const duration = prefersReducedMotion() ? 0 : 0.42;
    const nodes = [oneRef.current, twoRef.current, threeRef.current].filter(
      (node): node is HTMLDivElement => node != null,
    );
    xTosRef.current = nodes.map((node) => gsap.quickTo(node, "x", { ...QUICK, duration }));
    yTosRef.current = nodes.map((node) => gsap.quickTo(node, "y", { ...QUICK, duration }));
    return () => {
      xTosRef.current = [];
      yTosRef.current = [];
      for (const node of nodes) {
        gsap.killTweensOf(node);
        gsap.set(node, { x: 0, y: 0, force3D: false });
      }
    };
  }, []);

  const rest = () => {
    for (const xTo of xTosRef.current) xTo(0);
    for (const yTo of yTosRef.current) yTo(0);
  };

  const pull = (event: PointerEvent<HTMLDivElement>) => {
    const nodes = [oneRef.current, twoRef.current, threeRef.current];
    nodes.forEach((node, index) => {
      if (!node) return;
      const next = magnetDelta(node, event.clientX, event.clientY);
      xTosRef.current[index]?.(next.x);
      yTosRef.current[index]?.(next.y);
    });
  };

  return (
    <div
      className="flex items-center justify-center rounded-large border-token bg-muted/40 p-3xlarge touch-none"
      onPointerMove={pull}
      onPointerLeave={rest}
    >
      <Avatar.Group motion={{ groupItem: { hoverIn: false, hoverOut: false } }}>
        <Avatar
          ref={oneRef}
          size="base"
          label="One"
          src={PIN_IMAGE1}
          alt=""
          loading="lazy"
        />
        <Avatar
          ref={twoRef}
          size="base"
          label="Two"
          src={PIN_IMAGE2}
          alt=""
          loading="lazy"
        />
        <Avatar
          ref={threeRef}
          size="base"
          label="Three"
          src={PIN_IMAGE3}
          alt=""
          loading="lazy"
        />
      </Avatar.Group>
    </div>
  );
}
