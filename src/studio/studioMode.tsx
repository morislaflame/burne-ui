import { useCallback, type ReactNode } from "react";

import {
  SKIN_LAYER_SLOTS,
  SKIN_MOTION_SLOTS,
  SKIN_TARGET_SLOTS,
} from "@/skins/skinLiveSlots.generated";

import { skinSlotId, StudioSlotProvider, useStudioMode } from "./studioModeContext";

const LIVE_SKIN_SLOTS = new Set<string>([
  ...SKIN_TARGET_SLOTS,
  ...SKIN_LAYER_SLOTS,
  ...SKIN_MOTION_SLOTS,
]);

export { skinSlotId, useStudioMode };

/** Studio canvas only. Production trees leave this off, so nodes stay unmarked. */
export function StudioModeProvider({ children }: { children: ReactNode }) {
  const isLive = useCallback((id: string) => LIVE_SKIN_SLOTS.has(id), []);
  return <StudioSlotProvider isLive={isLive}>{children}</StudioSlotProvider>;
}

export function isLiveSkinSlot(id: string): boolean {
  return LIVE_SKIN_SLOTS.has(id);
}
