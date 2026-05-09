import { animate, cubicBezier, remove } from "animejs";
import { useLayoutEffect, useRef } from "react";
import type { PointerEvent } from "react";

export type ConvergeRipple = { id: number; x: number; y: number; size: number };

const convergeRippleEase = cubicBezier(0.25, 0.55, 0.35, 0.95);

function maxDistanceToCorners(px: number, py: number, w: number, h: number) {
  const corners: [number, number][] = [
    [0, 0],
    [w, 0],
    [0, h],
    [w, h],
  ];
  return Math.max(...corners.map(([cx, cy]) => Math.hypot(cx - px, cy - py)));
}

export function createConvergeRippleFromPointer(
  e: PointerEvent<HTMLElement>,
  id: number,
): ConvergeRipple {
  const r = e.currentTarget.getBoundingClientRect();
  const x = e.clientX - r.left;
  const y = e.clientY - r.top;
  const size = maxDistanceToCorners(x, y, r.width, r.height) * 2;
  return { id, x, y, size };
}

function ConvergeRippleDot({
  id,
  x,
  y,
  size,
  durationMs,
  opacityFrom,
  background,
  onDone,
}: ConvergeRipple & {
  durationMs: number;
  opacityFrom: number;
  background: string;
  onDone: (id: number) => void;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    let finished = false;
    remove(el);
    const anim = animate(el, {
      scale: [1, 0],
      opacity: [opacityFrom, 0],
      duration: durationMs,
      ease: convergeRippleEase,
    });
    void anim.then(() => {
      if (!finished) onDoneRef.current(id);
    });
    return () => {
      finished = true;
      remove(el);
      anim.revert();
    };
  }, [id, x, y, size, durationMs, opacityFrom, background]);

  return (
    <span
      ref={ref}
      className="pointer-events-none absolute z-0 rounded-full"
      style={{
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        background,
        transformOrigin: "center center",
      }}
      aria-hidden
    />
  );
}

export function ConvergeRippleLayer({
  ripples,
  tone,
  onDone,
  durationMs = 480,
  opacityFrom = 0.42,
}: {
  ripples: ConvergeRipple[];
  tone: string;
  onDone: (id: number) => void;
  durationMs?: number;
  opacityFrom?: number;
}) {
  return (
    <>
      {ripples.map((rp) => (
        <ConvergeRippleDot
          key={rp.id}
          {...rp}
          background={tone}
          durationMs={durationMs}
          opacityFrom={opacityFrom}
          onDone={onDone}
        />
      ))}
    </>
  );
}
