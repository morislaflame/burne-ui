import { useMemo } from "react";

import type { MotionPhaseName } from "@/components/core/utils/slotMotion";

import { useSkin, useSkinRegistryRevision } from "./skinContext";
import { useInstallSkinLookup, lookupSkin } from "./skinLookup";
import { resolveSkinLayer, type ResolvedSkinLayer } from "./resolveSkinLayer";
import type { SkinMotionPhaseValue, SkinMotionSlot, SkinTargetSlot } from "./skinTypes";

export type SkinSlotView = {
  /** Class string from a string target or `{ replace }`. */
  className?: string;
  /** Classes from `{ extend }`. */
  extend?: string;
  layer: ResolvedSkinLayer | null;
  motion?: Partial<Record<MotionPhaseName, SkinMotionPhaseValue>>;
};

const EMPTY: SkinSlotView = { layer: null };

function readTarget(spec: unknown): Pick<SkinSlotView, "className" | "extend"> {
  if (typeof spec === "string") return { className: spec };
  if (spec && typeof spec === "object") {
    if ("replace" in spec && typeof spec.replace === "string") return { className: spec.replace };
    if ("extend" in spec && typeof spec.extend === "string") return { extend: spec.extend };
  }
  return {};
}

/**
 * Classes, layer, and motion of `slot` on the active skin.
 * No active skin → empty view. A typo is empty here; the validator rejects it.
 */
export function useSkinSlot(slot: string): SkinSlotView {
  const revision = useSkinRegistryRevision();
  useInstallSkinLookup();
  const scope = useSkin();
  const name = scope?.active ? scope.name : null;
  return useMemo(() => {
    // `revision` bumps when a skin registers. `lookupSkin` reads that registry.
    void revision;
    if (!name) return EMPTY;
    const skin = lookupSkin(name);
    if (!skin) return EMPTY;
    const target = readTarget(skin.targets?.[slot as SkinTargetSlot]);
    const motion = skin.motion?.[slot as SkinMotionSlot];
    const layer = resolveSkinLayer(name, slot);
    return { ...target, layer, motion };
  }, [name, slot, revision]);
}
