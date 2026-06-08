import { animate, remove } from "animejs";
import { useLayoutEffect, useRef } from "react";
import type { ConvergeRipple } from "./convergeRippleGeometry";
import {
  MOTION_RIPPLE_DEFAULT_DURATION_MS,
  MOTION_RIPPLE_DEFAULT_OPACITY_FROM,
  MOTION_RIPPLE_EASE,
  MOTION_RIPPLE_MIN_SCALE,
} from "./motionTokens";

export type RippleDirection = "in" | "out";

function ConvergeRippleDot({
  id,
  x,
  y,
  size,
  durationMs,
  opacityFrom,
  background,
  direction,
  onDone,
}: ConvergeRipple & {
  durationMs: number;
  opacityFrom: number;
  background: string;
  direction: RippleDirection;
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
    const scaleFrom = direction === "out" ? MOTION_RIPPLE_MIN_SCALE : 1;
    const scaleTo = direction === "out" ? 1 : MOTION_RIPPLE_MIN_SCALE;
    const anim = animate(el, {
      scale: [scaleFrom, scaleTo],
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
  }, [id, x, y, size, durationMs, opacityFrom, background, direction]);

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
        transform: `scale(${direction === "out" ? MOTION_RIPPLE_MIN_SCALE : 1})`,
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
  direction = "in",
}: {
  ripples: ConvergeRipple[];
  tone: string;
  onDone: (id: number) => void;
  durationMs?: number;
  opacityFrom?: number;
  direction?: RippleDirection;
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
          direction={direction}
          onDone={onDone}
        />
      ))}
    </>
  );
}
