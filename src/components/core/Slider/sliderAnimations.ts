/**
 * Slot motion for Slider — look here first.
 *
 * DOM slots: `track`, `rail`, `fill`, `thumb`, `icon`, `header`, `value`
 *
 * Host: Root (`SliderMotionProvider` + defaults). Thumb press via `useMotionPart` `pressPhases`.
 * Fill `left`/`width`/`bottom`/`height` stay kit-internal (`applySliderFillStyle`).
 * `thumbShell` opacity when disabled is internal GSAP, not a public slot.
 * Marks are not a motion slot (many nodes, last-register-wins).
 */
import { killMotion } from "@/components/core/utils/gsapMotion";
import { useLayoutEffect, useRef } from "react";

import type { SliderMotion } from "./sliderTypes";

export const SLIDER_MOTION_DEFAULTS: SliderMotion = {
  thumb: {
    pressIn: "pressSqueeze",
    pressOut: false,
  },
};

export function resolveSliderMotionDefaults({ disabled }: { disabled?: boolean }): SliderMotion {
  if (disabled) {
    return {
      thumb: {
        pressIn: false,
        pressOut: false,
      },
    };
  }
  return SLIDER_MOTION_DEFAULTS;
}

export function useSliderThumbShellAnimation(disabled?: boolean) {
  const shellRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;
    killMotion(shell);
    shell.style.opacity = disabled ? "0.48" : "1";
  }, [disabled]);

  return shellRef;
}

export function useSliderFillCleanup(fillRef: React.RefObject<HTMLSpanElement | null>) {
  useLayoutEffect(() => {
    const fill = fillRef.current;
    return () => {
      if (fill) killMotion(fill);
    };
  }, [fillRef]);
}

export function applySliderFillStyle(
  fill: HTMLSpanElement,
  style: { left?: string; width?: string; bottom?: string; height?: string },
  orientation: "horizontal" | "vertical",
) {
  killMotion(fill);
  fill.style.left = style.left ?? "";
  fill.style.width = style.width ?? "";
  fill.style.bottom = style.bottom ?? "";
  fill.style.height = style.height ?? "";
  if (orientation === "horizontal") {
    fill.style.bottom = "";
    fill.style.height = "";
  } else {
    fill.style.left = "";
    fill.style.width = "";
  }
}
