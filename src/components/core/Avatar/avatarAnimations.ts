/**
 * Slot motion for Avatar — look here first.
 *
 * DOM slots: `root` (circle / gloss wrap), `image`, `fallback`,
 * `groupItem` (`Avatar.Group` item wrap — nested scope per item)
 *
 * Hosts:
 * - `Avatar.Image` plays `enter` / `leave` when load status changes.
 * - `Avatar.Group` item wrap plays `hoverIn` / `hoverOut`.
 *
 * Defaults: `resolveAvatarMotionDefaults` / `resolveAvatarGroupItemMotionDefaults`.
 * `glossWrap` is a layout wrapper, not a public motion slot.
 */
import { useLayoutEffect, useRef } from "react";

import { applyContentFadeInstant } from "@/components/core/utils/slotMotion/recipes/contentFade";
import type { MotionScopeValue } from "@/components/core/utils/slotMotion";

import type { AvatarMotion } from "./avatarTypes";

export const AVATAR_GROUP_HOVER_TRANSLATE_Y = -10;
export const AVATAR_GROUP_HOVER_SCALE = 1.08;

export function resolveAvatarMotionDefaults(): AvatarMotion {
  return {
    image: { enter: "contentFade", leave: "contentFade" },
  };
}

export function resolveAvatarGroupItemMotionDefaults(): AvatarMotion {
  return {
    groupItem: {
      hoverIn: { y: AVATAR_GROUP_HOVER_TRANSLATE_Y, scale: AVATAR_GROUP_HOVER_SCALE },
      hoverOut: { y: 0, scale: 1 },
    },
  };
}

export function useAvatarImageMotion(
  scope: MotionScopeValue | null,
  visible: boolean,
  imgRef: React.RefObject<HTMLImageElement | null>,
) {
  const prevVisibleRef = useRef<boolean | undefined>(undefined);

  useLayoutEffect(() => {
    const el = imgRef.current;
    if (!el || !scope) return;

    if (prevVisibleRef.current === undefined) {
      prevVisibleRef.current = visible;
      const value = scope.resolve("image", visible ? "enter" : "leave");
      if (value === false || value === undefined) {
        applyContentFadeInstant(el, visible);
      } else if (visible) {
        applyContentFadeInstant(el, false);
        scope.play("image", "enter", { el });
      } else {
        applyContentFadeInstant(el, false);
      }
      return;
    }

    if (prevVisibleRef.current === visible) return;
    prevVisibleRef.current = visible;
    const phase = visible ? "enter" : "leave";
    const value = scope.resolve("image", phase);
    if (value === false || value === undefined) {
      applyContentFadeInstant(el, visible);
      return;
    }
    scope.play("image", phase, { el });
  }, [imgRef, scope, visible]);
}
