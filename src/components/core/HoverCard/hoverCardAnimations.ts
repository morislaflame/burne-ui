/**
 * Slot motion for HoverCard — look here first.
 *
 * DOM slot on this scope: `trigger`.
 * Portal slots `content`, `header`, `title`, `description`, `body`, `arrow` are Popover's
 * scope (pass-through). The host that plays them is `HoverCard.Content`.
 * `play()` skips: there is no `root` slot. Use `playSlot`.
 *
 * The card opens on hover and focus. `hoverOut: false` lets a yoyo finish when the pointer leaves.
 */
import type { ForwardedRef, PointerEventHandler } from "react";

import { hasPointerPhases, useMotionPart } from "@/components/core/utils/slotMotion";

import { useOptionalHoverCardMotionScope } from "./hoverCardContext";
import type { HoverCardMotion, HoverCardPartMotion } from "./hoverCardTypes";

const HOVER_CARD_MOTION_DEFAULTS: HoverCardMotion = {};

export function resolveHoverCardMotionDefaults(): HoverCardMotion {
  return HOVER_CARD_MOTION_DEFAULTS;
}

export function useHoverCardTriggerMotion({
  motion,
  forwardedRef,
  onPointerOver,
  onPointerOut,
  onPointerDown,
  onPointerUp,
}: {
  motion?: HoverCardPartMotion;
  forwardedRef?: ForwardedRef<HTMLButtonElement>;
  onPointerOver?: PointerEventHandler<HTMLButtonElement>;
  onPointerOut?: PointerEventHandler<HTMLButtonElement>;
  onPointerDown?: PointerEventHandler<HTMLButtonElement>;
  onPointerUp?: PointerEventHandler<HTMLButtonElement>;
}) {
  const scope = useOptionalHoverCardMotionScope();
  const pointer = hasPointerPhases(motion ?? scope?.getRootMotion()?.trigger);
  return useMotionPart<HTMLButtonElement>({
    scope,
    slot: "trigger",
    motion,
    forwardedRef,
    pointerPhases: pointer,
    pressPhases: pointer,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  });
}
