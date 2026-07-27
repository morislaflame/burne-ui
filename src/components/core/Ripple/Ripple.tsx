import { useLayoutEffect, useRef } from "react";

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

export function Ripple({
  color,
  disabled = false,
  duration = getMotionConfig().rippleDefaultDuration,
  direction = "out",
  className = "",
}: RippleProps) {
  const layerRef = useRef<HTMLSpanElement>(null);
  const { ripples, pushAtClientCoords, dismiss } = useConvergeRipples();
  const paint = resolveRipplePaint(color);

  useLayoutEffect(() => {
    const layer = layerRef.current;
    if (!layer || disabled) return;

    const target = resolveRippleEventTarget(layer);
    if (!target) return;

    const handler = (ev: PointerEvent) => {
      if (disabled || prefersReducedMotion() || !isMotionFeatureEnabled("enableRipple")) return;
      if (ev.defaultPrevented) return;
      if (ev.pointerType === "mouse" && ev.button !== 0) return;
      pushAtClientCoords(target, ev.clientX, ev.clientY);
    };

    target.addEventListener("pointerdown", handler);
    return () => target.removeEventListener("pointerdown", handler);
  }, [disabled, pushAtClientCoords]);

  return (
    <span
      ref={layerRef}
      className={cn(RIPPLE_LAYER_CLASS, className)}
      {...rippleLayerA11yProps()}
    >
      <ConvergeRippleLayer
        ripples={ripples}
        tone={paint}
        onDone={dismiss}
        durationMs={duration}
        opacityFrom={getMotionConfig().rippleDefaultOpacityFrom}
        direction={direction}
      />
    </span>
  );
}
