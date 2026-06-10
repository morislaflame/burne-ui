import { animate, cubicBezier, remove } from "animejs";
import { useLayoutEffect, useRef } from "react";
import type { ConvergeRipple } from "./convergeRippleGeometry";
import { getMotionConfig } from "./motionConfig";

/** Минимальный масштаб «ядра» ripple — визуальная константа, не конфигурируется. */
const RIPPLE_MIN_SCALE = 0.12;

/**
 * Строит animejs-easing из rippleEaseCss.
 * Если строка содержит `cubic-bezier(...)` — парсим числа, иначе передаём как есть.
 */
function getRippleEase() {
  const css = getMotionConfig().rippleEaseCss;
  const m = /cubic-bezier\(\s*([\d.]+),\s*([\d.]+),\s*([\d.]+),\s*([\d.]+)\s*\)/.exec(css);
  if (m) return cubicBezier(+m[1]!, +m[2]!, +m[3]!, +m[4]!);
  return css;
}

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
    const scaleFrom = direction === "out" ? RIPPLE_MIN_SCALE : 1;
    const scaleTo = direction === "out" ? 1 : RIPPLE_MIN_SCALE;
    const anim = animate(el, {
      scale: [scaleFrom, scaleTo],
      opacity: [opacityFrom, 0],
      duration: durationMs,
      ease: getRippleEase(),
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
