import { useLayoutEffect, useRef } from "react";

import { prefersReducedInteractiveHoverLift } from "@/components/core/utils/hoverInteractiveLift";
import { getMotionConfig } from "@/components/core/utils/motionConfig";
import { ConvergeRippleLayer, type RippleDirection } from "@/components/core/utils/pressRipple";
import { useConvergeRipples } from "@/components/core/utils/useConvergeRipples";
import { cn } from "@/utils/cn";

import { RIPPLE_COLOR, type RippleColor } from "./rippleTokens";

function resolveRipplePaint(input?: string): string {
  if (input == null || input === "") return RIPPLE_COLOR.neutral;
  if (Object.hasOwn(RIPPLE_COLOR, input))
    return RIPPLE_COLOR[input as RippleColor];
  return input;
}

function resolveRippleEventTarget(layer: HTMLElement): HTMLElement | null {
  const interactive = layer.closest(
    "button,a[href],[role='button']",
  ) as HTMLElement | null;
  return interactive ?? layer.parentElement;
}

export type RippleProps = {
  color?: RippleColor | string;
  disabled?: boolean;
  duration?: number;
  direction?: RippleDirection;
  className?: string;
};

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
      if (disabled || prefersReducedInteractiveHoverLift() || !getMotionConfig().enableRipple) return;
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
      className={cn(
        "pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[inherit]",
        className,
      )}
      aria-hidden
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

export type { RippleDirection };
