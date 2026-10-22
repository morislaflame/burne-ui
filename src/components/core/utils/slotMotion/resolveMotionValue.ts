import type {
  MotionPartPhases,
  MotionPhaseName,
  MotionSlotMap,
  MotionValue,
} from "./slotMotionTypes";

/** Public maps must not tween layout. `margin*` counts as `margin`. */
const MOTION_LAYOUT_KEYS = ["width", "height", "top", "left", "margin"] as const;

const warnedLayoutValues = new WeakSet<object>();

function layoutKeysOf(value: object): string[] {
  return Object.keys(value).filter(
    (key) =>
      (MOTION_LAYOUT_KEYS as readonly string[]).includes(key) || key.startsWith("margin"),
  );
}

/**
 * Dev-only. A vars object (`as any`) or factory vars (`ctx.to`) with layout keys
 * warns once per object. The kit recipe `searchExpand` tweens shell width inside
 * the recipe, not through this map, so a recipe name never warns.
 */
export function warnMotionLayoutKeys(value: unknown): void {
  if (process.env.NODE_ENV === "production") return;
  if (value === undefined || value === false || typeof value !== "object" || value === null) return;
  if (warnedLayoutValues.has(value)) return;
  const keys = layoutKeysOf(value);
  if (keys.length === 0) return;
  warnedLayoutValues.add(value);
  console.warn(
    `[burne-ui] motion: layout key "${keys.join(", ")}" is not a public var. Use x, y, or scale. SearchInput shell width is the kit recipe searchExpand.`,
  );
}
 
/**
 * Precedence: part prop → root `motion[slot]` → kit default.
 * `false` is a real value (disable) and does not fall through.
 */
export function resolveMotionValue(
  partValue: MotionValue | undefined,
  slotValue: MotionValue | undefined,
  defaultValue: MotionValue | undefined,
): MotionValue | undefined {
  const resolved = partValue !== undefined ? partValue : slotValue !== undefined ? slotValue : defaultValue;
  warnMotionLayoutKeys(resolved);
  return resolved;
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
    if (slot === "events") continue;
    merged[slot] = { ...base[slot], ...override[slot] };
  }
  return merged;
}
 