import { gsap, killMotion } from "@/components/core/utils/gsapMotion";
import {
  isMotionFeatureEnabled,
  motionContentFade,
  motionInteractive,
} from "@/components/core/utils/motionConfig";
import { usePrefersReducedMotion } from "@/components/core/utils/reducedMotion";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  type RefObject,
} from "react";

export const AVATAR_GROUP_HOVER_TRANSLATE_Y = -10;
export const AVATAR_GROUP_HOVER_SCALE = 1.08;

export function useAvatarImageFade(visible: boolean, imgRef: RefObject<HTMLImageElement | null>) {
  const reduceMotionPreferred = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const el = imgRef.current;
    if (!el) return;

    const reduceMotion =
      reduceMotionPreferred || !isMotionFeatureEnabled("enableContentFade");

    killMotion(el);

    if (reduceMotion) {
      gsap.set(el, { autoAlpha: visible ? 1 : 0 });
      return;
    }

    gsap.to(el, {
      autoAlpha: visible ? 1 : 0,
      ...motionContentFade(),
      overwrite: "auto",
    });
  }, [imgRef, reduceMotionPreferred, visible]);
}

export function useAvatarGroupItemMotion(wrapRef: RefObject<HTMLDivElement | null>) {
  const reduced = usePrefersReducedMotion();

  const applyRest = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    killMotion(el);
    if (reduced) {
      el.style.transform = "";
      return;
    }
    gsap.to(el, { y: 0, scale: 1, ...motionInteractive(), overwrite: "auto" });
  }, [reduced, wrapRef]);

  const applyLift = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    killMotion(el);
    if (reduced) {
      el.style.transform = `translateY(${AVATAR_GROUP_HOVER_TRANSLATE_Y}px) scale(${AVATAR_GROUP_HOVER_SCALE})`;
      return;
    }
    gsap.to(el, {
      y: AVATAR_GROUP_HOVER_TRANSLATE_Y,
      scale: AVATAR_GROUP_HOVER_SCALE,
      ...motionInteractive(),
      overwrite: "auto",
    });
  }, [reduced, wrapRef]);

  useEffect(() => {
    const el = wrapRef.current;
    return () => {
      if (el) killMotion(el);
    };
  }, [wrapRef]);

  return { applyLift, applyRest };
}
