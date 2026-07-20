import { useLayoutEffect, useRef } from "react";
import { PRESS_RIPPLE_DOT_CLASS } from "./pressRippleStyles";
import type { ConvergeRipple } from "./convergeRippleGeometry";
import { ensureRippleEase, gsap, killMotion } from "./gsapMotion";
import { getMotionConfig } from "./motionConfig";

/** Minimum ripple "core" scale — visual constant, not configurable. */
const RIPPLE_MIN_SCALE = 0.12;

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
    killMotion(el);
    const scaleFrom = direction === "out" ? RIPPLE_MIN_SCALE : 1;
    const scaleTo = direction === "out" ? 1 : RIPPLE_MIN_SCALE;
    const tween = gsap.fromTo(
      el,
      { scale: scaleFrom, autoAlpha: opacityFrom },
      {
        scale: scaleTo,
        autoAlpha: 0,
        duration: durationMs / 1000,
        ease: ensureRippleEase(),
        onComplete: () => {
          if (!finished) onDoneRef.current(id);
        },
      },
    );
    return () => {
      finished = true;
      tween.kill();
      killMotion(el);
    };
  }, [id, x, y, size, durationMs, opacityFrom, background, direction]);

  return (
    <span
      ref={ref}
      className={PRESS_RIPPLE_DOT_CLASS}
      style={{
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        background,
        transformOrigin: "center center",
        transform: `scale(${direction === "out" ? RIPPLE_MIN_SCALE : 1})`,
      }}
      aria-hidden
    />
  );
}

export function ConvergeRippleLayer({
  ripples,
  tone,
  onDone,
  durationMs = getMotionConfig().rippleDefaultDuration,
  opacityFrom = getMotionConfig().rippleDefaultOpacityFrom,
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
