import { useCallback, useLayoutEffect, useMemo, useRef, useState, type RefObject } from "react";

import { prefersReducedMotion, usePrefersReducedMotion } from "@/components/core/utils/reducedMotion";
import { clearWillChangeOnComplete, gsap, killMotion, setWillChangeTransform } from "@/components/core/utils/gsapMotion";
import { motionSelectionFill, isMotionFeatureEnabled } from "@/components/core/utils/motionConfig";

/** Marks ToggleButton / Calendar cell fill for SSR CSS in `styles.css`. */
export const SELECTION_FILL_DATA_ATTR = "data-selection-fill";

/** Set by GSAP init — removes SSR hide rule so animations own visibility. */
export const SELECTION_FILL_READY_ATTR = "data-selection-fill-ready";

/**
 * Fill for ToggleButton / CalendarInteractiveCell.
 * Do not set `style={{ transform, opacity }}` on fill — React will overwrite GSAP on parent re-render.
 * SSR: CSS hides via `[data-selection-fill]:not([data-selection-fill-ready])[data-pressed="false"]`.
 *
 * On and off use the same `selectionFillEase` so appear/disappear feel equally paced
 * (mirroring out→in makes appear snappy and unfill sluggish).
 */
export function applyToggleButtonFillInstant(fill: HTMLElement, pressed: boolean) {
  killMotion(fill);
  fill.setAttribute(SELECTION_FILL_READY_ATTR, "");
  fill.dataset.pressed = pressed ? "true" : "false";
  gsap.set(fill, { scale: pressed ? 1 : 0, autoAlpha: pressed ? 1 : 0 });
}

export function createToggleButtonFillRefCallback(
  ref: RefObject<HTMLElement | null>,
  initialPressed: boolean,
) {
  return (node: HTMLElement | null) => {
    ref.current = node;
    if (node && !node.hasAttribute(SELECTION_FILL_READY_ATTR)) {
      applyToggleButtonFillInstant(node, initialPressed);
    }
  };
}

export function animateToggleButtonFill(
  fill: HTMLElement,
  pressed: boolean,
  reduceMotion = prefersReducedMotion() || !isMotionFeatureEnabled("enableToggleButtonFill"),
): void {
  killMotion(fill);
  fill.setAttribute(SELECTION_FILL_READY_ATTR, "");
  fill.dataset.pressed = pressed ? "true" : "false";
  if (reduceMotion) {
    gsap.set(fill, { scale: pressed ? 1 : 0, autoAlpha: pressed ? 1 : 0 });
    return;
  }

  const fillVars = motionSelectionFill();

  if (pressed) {
    setWillChangeTransform(fill, true);
    gsap.fromTo(
      fill,
      { scale: 0, autoAlpha: 0 },
      {
        scale: 1,
        autoAlpha: 1,
        ...fillVars,
        overwrite: "auto",
        onComplete: clearWillChangeOnComplete(fill),
      },
    );
  } else {
    setWillChangeTransform(fill, true);
    gsap.to(fill, {
      scale: 0,
      autoAlpha: 0,
      ...fillVars,
      overwrite: "auto",
      onComplete: clearWillChangeOnComplete(fill),
    });
  }
}

export function useToggleButtonFillAnimation(
  pressed: boolean,
  fillRef: RefObject<HTMLElement | null>,
  options?: {
    /** While true — `useLayoutEffect` does not start fill (waiting for press-release). */
    deferFillFromPressRef?: RefObject<boolean>;
    onFillStart?: (pressed: boolean) => void;
    /** Host slot-motion play. Calendar keeps the default GSAP fill. */
    playFill?: (fill: HTMLElement, next: boolean, reduceMotion: boolean) => void;
  },
) {
  const deferFillFromPressRef = options?.deferFillFromPressRef;
  const onFillStart = options?.onFillStart;
  const playFill = options?.playFill;
  const initialPressedRef = useRef(pressed);
  const prevPressedRef = useRef<boolean | undefined>(undefined);
  const reduceMotion = usePrefersReducedMotion();
  /** Visual pressed — updates when fill actually starts, not on raw selection click. */
  const [displayPressed, setDisplayPressed] = useState(pressed);

  const bindFillRef = useMemo(
    () => createToggleButtonFillRefCallback(fillRef, initialPressedRef.current),
    [fillRef],
  );

  const animateTo = useCallback(
    (next: boolean) => {
      const fill = fillRef.current;
      if (!fill) return;
      if (prevPressedRef.current === next) return;
      prevPressedRef.current = next;
      setDisplayPressed(next);
      onFillStart?.(next);
      if (playFill) playFill(fill, next, reduceMotion);
      else animateToggleButtonFill(fill, next, reduceMotion);
    },
    [fillRef, onFillStart, playFill, reduceMotion],
  );

  useLayoutEffect(() => {
    const fill = fillRef.current;
    if (!fill) return;

    if (prevPressedRef.current === undefined) {
      prevPressedRef.current = pressed;
      setDisplayPressed(pressed);
      applyToggleButtonFillInstant(fill, pressed);
      return;
    }

    if (prevPressedRef.current === pressed) return;

    if (deferFillFromPressRef?.current) {
      return;
    }

    prevPressedRef.current = pressed;
    setDisplayPressed(pressed);
    onFillStart?.(pressed);
    if (playFill) playFill(fill, pressed, reduceMotion);
    else animateToggleButtonFill(fill, pressed, reduceMotion);
  }, [deferFillFromPressRef, onFillStart, playFill, pressed, fillRef, reduceMotion]);

  return { animateTo, bindFillRef, displayPressed };
}
