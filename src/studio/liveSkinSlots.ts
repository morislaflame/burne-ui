import { SKIN_LAYER_SLOTS, SKIN_MOTION_SLOTS, SKIN_TARGET_SLOTS } from "@/skins/skinLiveSlots.generated";

const LIVE_SKIN_SLOTS = new Set<string>([...SKIN_TARGET_SLOTS, ...SKIN_LAYER_SLOTS, ...SKIN_MOTION_SLOTS]);

/** A slot the kit renders and a skin can paint. */
export function isLiveSkinSlot(id: string): boolean {
  return LIVE_SKIN_SLOTS.has(id);
}
