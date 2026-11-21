import path from "node:path";

import {
  loadClassNamesTypes,
  loadMotionSlotKeys,
  SKIP_TYPES,
} from "../../../scripts/classNamesInventory.mjs";

const SRC_ROOT = path.resolve("src/components");

const loaded = loadClassNamesTypes(SRC_ROOT, { skip: new Set() });
const motionMaps = loadMotionSlotKeys(SRC_ROOT);

export const CLASS_NAMES_SLOTS: ReadonlyMap<string, readonly string[]> = loaded.types;
export const MOTION_SLOTS: ReadonlyMap<string, readonly string[]> = motionMaps;
export const SKIP_CONTRACT_TYPES: ReadonlySet<string> = SKIP_TYPES;

export function motionKeysForClassNames(typeName: string): readonly string[] | undefined {
  const motionName = typeName.replace(/ClassNames$/, "Motion");
  return MOTION_SLOTS.get(motionName);
}
