import { animate, remove } from "animejs";
import { useLayoutEffect, useRef } from "react";
import type { PointerEvent } from "react";

import {
  MOTION_RIPPLE_DEFAULT_DURATION_MS,
  MOTION_RIPPLE_DEFAULT_OPACITY_FROM,
  MOTION_RIPPLE_EASE,
} from "./motionTokens";

export type ConvergeRipple = { id: number; x: number; y: number; size: number };

function maxDistanceToCorners(px: number, py: number, w: number, h: number) {
  const corners: [number, number][] = [
    [0, 0],
    [w, 0],
    [0, h],
    [w, h],
  ];
  return Math.max(...corners.map(([cx, cy]) => Math.hypot(cx - px, cy - py)));
}

export function createConvergeRippleAtPointer(
  target: HTMLElement,
  clientX: number,
  clientY: number,
  id: number,
): ConvergeRipple {
  const r = target.getBoundingClientRect();
  const x = clientX - r.left;
  const y = clientY - r.top;
  const size = maxDistanceToCorners(x, y, r.width, r.height) * 2;
  return { id, x, y, size };
}

/** Только в синхронной фазе обработчика: позже `e.currentTarget` у React может стать `null`. */
export function createConvergeRippleFromPointer(
  e: PointerEvent<HTMLElement>,
  id: number,
): ConvergeRipple | null {
  const target = e.currentTarget;
  if (!target) return null;
  return createConvergeRippleAtPointer(target, e.clientX, e.clientY, id);
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
      ease: MOTION_RIPPLE_EASE,
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
  durationMs = MOTION_RIPPLE_DEFAULT_DURATION_MS,
  opacityFrom = MOTION_RIPPLE_DEFAULT_OPACITY_FROM,
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
