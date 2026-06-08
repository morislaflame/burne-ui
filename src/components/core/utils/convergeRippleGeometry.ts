import type { PointerEvent } from "react";

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
