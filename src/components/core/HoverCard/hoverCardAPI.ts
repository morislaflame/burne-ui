import { hasCompoundChild } from "@/components/core/utils/hasCompoundChild";
import type { ReactNode } from "react";

import type { HoverCardMotion } from "./hoverCardTypes";

export const HOVER_CARD_TRIGGER_NAME = "HoverCardTrigger";

export function isHoverCardCompound(children: ReactNode): boolean {
  return hasCompoundChild(children, HOVER_CARD_TRIGGER_NAME);
}

type MotionWithTrigger = { trigger?: HoverCardMotion["trigger"] };

/** Trigger stays on the HoverCard scope. Every other key is the Popover portal map. */
export function splitHoverCardMotion<T extends MotionWithTrigger>(motion: T | undefined) {
  if (motion == null) {
    return { trigger: undefined, popoverMotion: undefined as (Omit<T, "trigger"> | undefined) };
  }
  const { trigger, ...popoverMotion } = motion;
  const rest = popoverMotion as Omit<T, "trigger">;
  return {
    trigger,
    popoverMotion: Object.keys(rest).length > 0 ? rest : undefined,
  };
}
