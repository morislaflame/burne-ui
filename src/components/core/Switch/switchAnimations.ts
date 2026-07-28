import { clearWillChangeOnComplete, gsap, killMotion, setWillChangeTransform } from "@/components/core/utils/gsapMotion";
import { animateInteractivePressSqueeze } from "@/components/core/utils/hoverInteractiveLift";
import { usePrefersReducedMotion } from "@/components/core/utils/reducedMotion";
import {
  isMotionFeatureEnabled,
  motionInteractive,
  motionSwitchThumb,
} from "@/components/core/utils/motionConfig";
import { usePressableElementTextMotion } from "@/components/core/utils/usePressableElementTextMotion";
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

import { measureSwitchTravel, resolveFallbackThumbPx } from "./switchGeometry";
import type { UseSwitchAnimationsProps, UseSwitchTrackAnimationsProps } from "./switchTypes";

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
  trackRef,
  trackFillRef,
  thumbRef,
  thumbShellRef,
  iconOffRef,
  iconOnRef,
}: UseSwitchTrackAnimationsProps) {
  const reduceMotion = usePrefersReducedMotion();
  const switchMotionOff = reduceMotion || !isMotionFeatureEnabled("enableSwitchThumb");
  const fallbackTravelPx = resolveFallbackThumbPx(thickness, size);
  const travelPxRef = useRef(fallbackTravelPx);
  const trackFillFirstLayoutRef = useRef(true);
  const thumbFirstLayoutRef = useRef(true);

  const syncThumbPosition = useCallback(
    (nextChecked: boolean, travelPx: number) => {
      const thumb = thumbRef.current;
      if (!thumb) return;

      const targetX = nextChecked ? travelPx : 0;

      if (switchMotionOff || thumbFirstLayoutRef.current) {
        thumbFirstLayoutRef.current = false;
        killMotion(thumb);
        thumb.style.transform = `translate(${targetX}px, 0)`;
        return;
      }

      killMotion(thumb);
      setWillChangeTransform(thumb, true);
      void gsap.to(thumb, {
        x: targetX,
        ...motionSwitchThumb(),
        overwrite: "auto",
        onComplete: clearWillChangeOnComplete(thumb),
      });
    },
    [switchMotionOff, thumbRef],
  );

  useLayoutEffect(() => {
    travelPxRef.current = fallbackTravelPx;
    syncThumbPosition(checked, travelPxRef.current);
  }, [checked, fallbackTravelPx, syncThumbPosition]);

  useLayoutEffect(() => {
    const track = trackRef.current;
    const thumb = thumbShellRef.current;
    if (!track || !thumb) return;

    const update = () => {
      travelPxRef.current = measureSwitchTravel(track, thumb);
      syncThumbPosition(checked, travelPxRef.current);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(track);
    ro.observe(thumb);
    return () => ro.disconnect();
  }, [checked, size, syncThumbPosition, thickness, fallbackTravelPx, trackRef, thumbShellRef]);

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
    const trackFill = trackFillRef.current;
    if (!trackFill) return;

    if (switchMotionOff) {
      killMotion(trackFill);
      trackFill.style.opacity = checked ? "1" : "0";
      return;
    }

    if (trackFillFirstLayoutRef.current) {
      trackFillFirstLayoutRef.current = false;
      killMotion(trackFill);
      trackFill.style.opacity = checked ? "1" : "0";
      return;
    }

    killMotion(trackFill);
    if (checked) {
      void gsap.fromTo(
        trackFill,
        { autoAlpha: 0 },
        { autoAlpha: 1, ...motionInteractive(), overwrite: "auto" },
      );
    } else {
      void gsap.to(trackFill, { autoAlpha: 0, ...motionInteractive(), overwrite: "auto" });
    }
  }, [checked, switchMotionOff, trackFillRef]);

  useLayoutEffect(() => {
    if (!iconOffRef.current && !iconOnRef.current) return;

    if (switchMotionOff) {
      if (iconOffRef.current) {
        killMotion(iconOffRef.current);
        iconOffRef.current.style.opacity = checked ? "0" : "1";
      }
      if (iconOnRef.current) {
        killMotion(iconOnRef.current);
        iconOnRef.current.style.opacity = checked ? "1" : "0";
      }
      return;
    }

    if (iconOffRef.current) {
      killMotion(iconOffRef.current);
      if (checked) {
        void gsap.to(iconOffRef.current, {
          autoAlpha: 0,
          scale: 0.88,
          ...motionInteractive(),
          overwrite: "auto",
        });
      } else {
        void gsap.fromTo(
          iconOffRef.current,
          { autoAlpha: 0, scale: 0.88 },
          { autoAlpha: 1, scale: 1, ...motionInteractive(), overwrite: "auto" },
        );
      }
    }
    if (iconOnRef.current) {
      killMotion(iconOnRef.current);
      if (checked) {
        void gsap.fromTo(
          iconOnRef.current,
          { autoAlpha: 0, scale: 0.88 },
          { autoAlpha: 1, scale: 1, ...motionInteractive(), overwrite: "auto" },
        );
      } else {
        void gsap.to(iconOnRef.current, {
          autoAlpha: 0,
          scale: 0.88,
          ...motionInteractive(),
          overwrite: "auto",
        });
      }
    }
  }, [checked, iconOffRef, iconOnRef, switchMotionOff]);

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
    void animateInteractivePressSqueeze(shell);
  }, [switchMotionOff, squeezeToken, thumbShellRef]);
}
