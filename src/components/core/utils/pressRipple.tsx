import { memo, useLayoutEffect, useRef } from "react";
import { PRESS_RIPPLE_DOT_CLASS } from "./pressRippleStyles";
import type { ConvergeRipple } from "./convergeRippleGeometry";
import { ensureRippleEase, gsap, killMotion } from "./gsapMotion";
import { useMotionConfig } from "./motionConfigContext";

/** Minimum ripple "core" scale — intentional visual constant, not in `configureMotion`. */
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
  easeCss,
  onDone,
}: ConvergeRipple & {
  durationMs: number;
  opacityFrom: number;
  background: string;
  direction: RippleDirection;
  easeCss: string;
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
        ease: ensureRippleEase(easeCss),
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
  }, [id, x, y, size, durationMs, opacityFrom, background, direction, easeCss]);

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

export const ConvergeRippleLayer = memo(function ConvergeRippleLayer({
  ripples,
  tone,
  onDone,
  durationMs,
  opacityFrom,
  direction = "in",
}: {
  ripples: ConvergeRipple[];
  tone: string;
  onDone: (id: number) => void;
  durationMs?: number;
  opacityFrom?: number;
  direction?: RippleDirection;
}) {
  const motion = useMotionConfig();
  const resolvedDuration = durationMs ?? motion.rippleDefaultDuration;
  const resolvedOpacity = opacityFrom ?? motion.rippleDefaultOpacityFrom;
  return (
    <>
      {ripples.map((rp) => (
        <ConvergeRippleDot
          key={rp.id}
          {...rp}
          background={tone}
          durationMs={resolvedDuration}
          opacityFrom={resolvedOpacity}
          direction={direction}
          easeCss={motion.rippleEaseCss}
          onDone={onDone}
        />
      ))}
    </>
  );
});
