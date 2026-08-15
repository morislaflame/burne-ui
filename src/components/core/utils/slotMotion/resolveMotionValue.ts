import type {
  MotionPartPhases,
  MotionPhaseName,
  MotionSlotMap,
  MotionValue,
} from "./slotMotionTypes";

/**
 * Precedence: part prop → root `motion[slot]` → kit default.
 * `false` is a real value (disable) and does not fall through.
 */
export function resolveMotionValue(
  partValue: MotionValue | undefined,
  slotValue: MotionValue | undefined,
  defaultValue: MotionValue | undefined,
): MotionValue | undefined {
  if (partValue !== undefined) return partValue;
  if (slotValue !== undefined) return slotValue;
  return defaultValue;
}

export function resolveSlotPhase(
  slot: string,
  phase: MotionPhaseName,
  partMotion: MotionPartPhases | undefined,
  rootMotion: MotionSlotMap | undefined,
  defaults: MotionSlotMap | undefined,
): MotionValue | undefined {
  const partValue = partMotion?.[phase];
  const slotValue = rootMotion?.[slot]?.[phase];
  const defaultValue = defaults?.[slot]?.[phase];
  return resolveMotionValue(partValue, slotValue, defaultValue);
}

export function mergeMotionSlotMaps(
  base: MotionSlotMap | undefined,
  override: MotionSlotMap | undefined,
): MotionSlotMap | undefined {
  if (!base) return override;
  if (!override) return base;
  const slots = new Set([...Object.keys(base), ...Object.keys(override)]);
  const merged: MotionSlotMap = {};
  for (const slot of slots) {
    merged[slot] = { ...base[slot], ...override[slot] };
  }
  return merged;
}
