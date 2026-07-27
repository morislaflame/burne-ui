import { memo, useImperativeHandle, useLayoutEffect, useRef, forwardRef } from "react";

import { prefersReducedMotion } from "@/components/core/utils/reducedMotion";
import { getMotionConfig, isMotionFeatureEnabled } from "@/components/core/utils/motionConfig";
import { ConvergeRippleLayer } from "@/components/core/utils/pressRipple";
import { useConvergeRipples } from "@/components/core/utils/useConvergeRipples";
import { cn } from "@/utils/cn";

import { rippleLayerA11yProps } from "./rippleA11y";
import { resolveRippleEventTarget, resolveRipplePaint } from "./rippleAPI";
import { RIPPLE_LAYER_CLASS } from "./rippleStyles";
import type { RippleProps } from "./rippleTypes";

export type { RippleProps, RippleDirection } from "./rippleTypes";

type ConvergeRipplePaintHandle = {
  pushAtClientCoords: (
    target: HTMLElement,
    clientX: number,
    clientY: number,
  ) => void;
};

type ConvergeRipplePaintProps = {
  tone: string;
  durationMs: number;
  opacityFrom: number;
  direction: NonNullable<RippleProps["direction"]>;
};

/** Owns ripple `useState` so push/dismiss re-render only this leaf, not the host. */
const ConvergeRipplePaint = memo(
  forwardRef<ConvergeRipplePaintHandle, ConvergeRipplePaintProps>(
    function ConvergeRipplePaint(
      { tone, durationMs, opacityFrom, direction },
      ref,
    ) {
      const { ripples, pushAtClientCoords, dismiss } = useConvergeRipples();

      useImperativeHandle(
        ref,
        () => ({ pushAtClientCoords }),
        [pushAtClientCoords],
      );

      return (
        <ConvergeRippleLayer
          ripples={ripples}
          tone={tone}
          onDone={dismiss}
          durationMs={durationMs}
          opacityFrom={opacityFrom}
          direction={direction}
        />
      );
    },
  ),
);

ConvergeRipplePaint.displayName = "ConvergeRipplePaint";

/**
 * Event host without ripple state — parent re-renders do not replay dots;
 * paint/dismiss stays inside memoized `ConvergeRipplePaint`.
 */
export function Ripple({
  color,
  disabled = false,
  duration = getMotionConfig().rippleDefaultDuration,
  direction = "out",
  className = "",
}: RippleProps) {
  const layerRef = useRef<HTMLSpanElement>(null);
  const paintRef = useRef<ConvergeRipplePaintHandle>(null);
  const paint = resolveRipplePaint(color);
  const opacityFrom = getMotionConfig().rippleDefaultOpacityFrom;

  useLayoutEffect(() => {
    const layer = layerRef.current;
    if (!layer || disabled) return;

    const target = resolveRippleEventTarget(layer);
    if (!target) return;

    const handler = (ev: PointerEvent) => {
      if (disabled || prefersReducedMotion() || !isMotionFeatureEnabled("enableRipple")) return;
      if (ev.defaultPrevented) return;
      if (ev.pointerType === "mouse" && ev.button !== 0) return;
      paintRef.current?.pushAtClientCoords(target, ev.clientX, ev.clientY);
    };

    target.addEventListener("pointerdown", handler);
    return () => target.removeEventListener("pointerdown", handler);
  }, [disabled]);

  return (
    <span
      ref={layerRef}
      className={cn(RIPPLE_LAYER_CLASS, className)}
      {...rippleLayerA11yProps()}
    >
      <ConvergeRipplePaint
        ref={paintRef}
        tone={paint}
        durationMs={duration}
        opacityFrom={opacityFrom}
        direction={direction}
      />
    </span>
  );
}
