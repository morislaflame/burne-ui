import { skinSlotIssue } from "./skinSlotRegistry";
import type { SkinDefinition } from "./skinTypes";
import { SKIN_LAYER_SLOTS, SKIN_MOTION_SLOTS, SKIN_SLOTS, SKIN_TARGET_SLOTS } from "./skinTypes";

const SLOT_SET = new Set<string>(SKIN_SLOTS);
const TARGET_SLOTS = new Set<string>(SKIN_TARGET_SLOTS);
const MOTION_SLOTS = new Set<string>(SKIN_MOTION_SLOTS);
const LAYER_SLOTS = new Set<string>(SKIN_LAYER_SLOTS);

function slotProblem(kind: string, name: string, slot: string, live: Set<string>): string | null {
  const issue = skinSlotIssue(slot, SLOT_SET, live);
  if (issue === "empty") return `skin "${name}" ${kind} slot is empty`;
  if (issue === "unknown") return `skin "${name}" ${kind} unknown slot "${slot}"`;
  if (issue === "dead") return `skin "${name}" ${kind} dead slot "${slot}"`;
  return null;
}

/** Dev-only. The slot tables stay out of a production component bundle. */
export function warnSkinSlots(skin: SkinDefinition): void {
  const error = (message: string) => {
    console.error(`[burne-ui] ${message}`);
  };
  if (skin.targets) {
    for (const slot of Object.keys(skin.targets)) {
      const problem = slotProblem("targets", skin.name, slot, TARGET_SLOTS);
      if (problem) error(problem);
    }
  }
  if (skin.motion) {
    for (const slot of Object.keys(skin.motion)) {
      if (slot === "config") continue;
      const problem = slotProblem("motion", skin.name, slot, MOTION_SLOTS);
      if (problem) error(problem);
    }
  }
  for (const slot of [
    ...Object.keys(skin.layers ?? {}),
    ...Object.keys(skin.layersDeclarative ?? {}),
  ]) {
    const problem = slotProblem("layers", skin.name, slot, LAYER_SLOTS);
    if (problem) error(problem);
  }
}
