/**
 * Slot motion for Switch — look here first.
 *
 * DOM slots: `track`, `fill`, `thumb`, `iconOff`, `iconOn` (Track nested host);
 * `label`, `hint`, `error` (Root scope — siblings of Control).
 * Host: `Switch.Track` (`useSwitchTrackAnimations`) plays `check` / `uncheck`
 * on track/fill/thumb/icons. Chrome `check` / `uncheck` plays from
 * `useSwitchChromeSlot` (`useSlotPhaseOnChange`).
 * Root passes the `motion` map; Track wraps defaults + `params.getTravelPx`.
 * Thumb shell squeeze and track disabled-opacity stay internal GSAP.
 * `Switch.Content` is `display: contents` — not a slot.
 */
import { killMotion } from "@/components/core/utils/gsapMotion";
import { animateInteractivePressSqueeze } from "@/components/core/utils/hoverInteractiveLift";
import { usePrefersReducedMotion } from "@/components/core/utils/reducedMotion";
import { isMotionFeatureEnabledFor } from "@/components/core/utils/motionConfig";
import { useMotionConfig } from "@/components/core/utils/motionConfigContext";
import { usePressableElementTextMotion } from "@/components/core/utils/usePressableElementTextMotion";
import {
  applySwitchFillInstant,
  applySwitchIconInstant,
  applySwitchThumbInstant,
} from "@/components/core/utils/slotMotion/recipes/switchThumb";
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

import {
  hasPointerPhases,
  useMotionPart,
  useOptionalEnterOnMount,
  useSlotPhaseOnChange,
} from "@/components/core/utils/slotMotion";

import { measureSwitchTravel, resolveFallbackThumbPx } from "./switchGeometry";
import {
  useOptionalSwitchFieldContext,
  useOptionalSwitchMotionScope,
  useSwitchMotionScope,
} from "./switchContext";
import type {
  SwitchCheckMotion,
  SwitchMotion,
  UseSwitchAnimationsProps,
  UseSwitchTrackAnimationsProps,
} from "./switchTypes";

export const SWITCH_MOTION_DEFAULTS: SwitchMotion = {
  thumb: { check: "switchThumb", uncheck: "switchThumb" },
  fill: { check: "switchFill", uncheck: "switchFill" },
  iconOn: { check: "switchIconOn", uncheck: "switchIconOn" },
  iconOff: { check: "switchIconOff", uncheck: "switchIconOff" },
};

export type SwitchChromeSlot = "label" | "hint" | "error";

export function useSwitchChromeSlot(
  slot: SwitchChromeSlot,
  motion?: SwitchCheckMotion,
) {
  const ctx = useOptionalSwitchFieldContext();
  const scope = useOptionalSwitchMotionScope();
  const pointer = hasPointerPhases(motion ?? scope?.getRootMotion()?.[slot]);
  const part = useMotionPart<HTMLElement>({
    scope,
    slot,
    motion,
    pointerPhases: pointer,
    pressPhases: pointer,
  });
  const synced = ctx != null && ctx.mergedChecked !== null;
  useSlotPhaseOnChange(synced ? scope : null, slot, ctx?.mergedChecked, {
    phase: ctx?.mergedChecked ? "check" : "uncheck",
    skipFirst: true,
    target: part.targetRef,
  });
  useOptionalEnterOnMount(scope, slot, part.targetRef);
  return part;
}

export function useSwitchTextMotion({
  isDisabled,
  enableTextMotion,
  textMotionRef,
  onPointerDown,
  onKeyDown,
}: UseSwitchAnimationsProps) {
  return usePressableElementTextMotion<HTMLLabelElement>({
    isDisabled: !!isDisabled,
    enabled: enableTextMotion,
    textMotionRef,
    onPointerDown,
    onKeyDown,
  });
}

export function useSwitchTrackAnimations({
  checked,
  disabled,
  size,
  thickness,
  squeezeToken,
  travelPxRef,
  trackRef,
  trackFillRef,
  thumbRef,
  thumbShellRef,
  iconOffRef,
  iconOnRef,
}: UseSwitchTrackAnimationsProps) {
  const config = useMotionConfig();
  const scope = useSwitchMotionScope();
  const reduceMotion = usePrefersReducedMotion();
  const switchMotionOff =
    reduceMotion || !isMotionFeatureEnabledFor(config, "enableSwitchThumb");
  const fallbackTravelPx = resolveFallbackThumbPx(thickness, size);
  const firstLayoutRef = useRef(true);

  const applyInstant = useCallback(
    (nextChecked: boolean, travelPx: number) => {
      if (thumbRef.current) applySwitchThumbInstant(thumbRef.current, nextChecked, travelPx);
      if (trackFillRef.current) applySwitchFillInstant(trackFillRef.current, nextChecked);
      if (iconOffRef.current) applySwitchIconInstant(iconOffRef.current, !nextChecked);
      if (iconOnRef.current) applySwitchIconInstant(iconOnRef.current, nextChecked);
    },
    [iconOffRef, iconOnRef, thumbRef, trackFillRef],
  );

  const playPhase = useCallback(
    (nextChecked: boolean, travelPx: number) => {
      const phase = nextChecked ? "check" : "uncheck";
      const playSlot = (
        slot: "thumb" | "fill" | "iconOff" | "iconOn" | "track",
        el: HTMLElement | null,
        onSkip: () => void,
      ) => {
        if (!el) return;
        const value = scope.resolve(slot, phase);
        if (value === false || value === undefined) {
          onSkip();
          return;
        }
        scope.play(slot, phase, { el });
      };

      playSlot("track", trackRef.current, () => {});
      playSlot("thumb", thumbRef.current, () => {
        if (thumbRef.current) applySwitchThumbInstant(thumbRef.current, nextChecked, travelPx);
      });
      playSlot("fill", trackFillRef.current, () => {
        if (trackFillRef.current) applySwitchFillInstant(trackFillRef.current, nextChecked);
      });
      playSlot("iconOff", iconOffRef.current, () => {
        if (iconOffRef.current) applySwitchIconInstant(iconOffRef.current, !nextChecked);
      });
      playSlot("iconOn", iconOnRef.current, () => {
        if (iconOnRef.current) applySwitchIconInstant(iconOnRef.current, nextChecked);
      });
    },
    [iconOffRef, iconOnRef, scope, thumbRef, trackFillRef, trackRef],
  );

  const syncThumbPosition = useCallback(
    (nextChecked: boolean, travelPx: number) => {
      travelPxRef.current = travelPx;
      if (!thumbRef.current && !trackFillRef.current && !iconOffRef.current && !iconOnRef.current) {
        return;
      }

      if (firstLayoutRef.current || switchMotionOff) {
        firstLayoutRef.current = false;
        applyInstant(nextChecked, travelPx);
        return;
      }

      playPhase(nextChecked, travelPx);
    },
    [applyInstant, iconOffRef, iconOnRef, playPhase, switchMotionOff, thumbRef, trackFillRef, travelPxRef],
  );

  useLayoutEffect(() => {
    const track = trackRef.current;
    const shell = thumbShellRef.current;
    const measure = () => {
      if (track && shell) {
        travelPxRef.current = measureSwitchTravel(track, shell);
      } else {
        travelPxRef.current = fallbackTravelPx;
      }
    };

    measure();
    syncThumbPosition(checked, travelPxRef.current);

    if (!track || !shell) return undefined;
    const ro = new ResizeObserver(() => {
      measure();
      syncThumbPosition(checked, travelPxRef.current);
    });
    ro.observe(track);
    ro.observe(shell);
    return () => ro.disconnect();
  }, [checked, fallbackTravelPx, syncThumbPosition, thickness, size, trackRef, thumbShellRef, travelPxRef]);

  useEffect(() => {
    const nodes = [
      trackFillRef.current,
      thumbRef.current,
      thumbShellRef.current,
      iconOffRef.current,
      iconOnRef.current,
      trackRef.current,
    ];
    return () => {
      for (const el of nodes) {
        if (el) killMotion(el);
      }
    };
  }, [iconOffRef, iconOnRef, thumbRef, thumbShellRef, trackFillRef, trackRef]);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    killMotion(track);
    track.style.opacity = disabled ? "0.48" : "1";
  }, [disabled, trackRef]);

  useLayoutEffect(() => {
    if (squeezeToken === 0 || switchMotionOff) return;
    const shell = thumbShellRef.current;
    if (!shell) return;
    void animateInteractivePressSqueeze(shell, { config });
  }, [config, switchMotionOff, squeezeToken, thumbShellRef]);
}
