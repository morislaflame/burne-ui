import {
  isMotionPhaseName,
  MOTION_PHASE_NAMES,
  type MotionPartPhases,
  type MotionSlotMap,
  type MotionValue,
} from "./slotMotionTypes";

const PHASE_SET = new Set<string>(MOTION_PHASE_NAMES);

/** App commands on `motion.events`. Do not use `MotionPhaseName` keys. */
export type MotionEvents<TEvent extends string = string> = {
  [K in TEvent]?: MotionValue;
};

/** Slot map plus sibling `events` (not a DOM slot). */
export type MotionMapWithEvents<TSlots extends object> = TSlots & {
  events?: MotionEvents;
};

/**
 * Root `motion` including optional `events`. Open index cannot be `MotionSlotMap`
 * (`events` values are `MotionValue`, not `MotionPartPhases`).
 */
export type MotionRootInput = {
  [slot: string]: MotionPartPhases | MotionEvents | undefined;
  events?: MotionEvents;
};

type NoPhaseKeys<T> = Extract<keyof T, (typeof MOTION_PHASE_NAMES)[number]> extends never
  ? T
  : never;

/**
 * Identity helper for a namespaced event map (`checkout:saving`).
 * Built-in phase names as keys are a type error and a dev `console.error`.
 */
export function createMotionEvents<const T extends Record<string, MotionValue>>(
  events: NoPhaseKeys<T>,
): T {
  if (process.env.NODE_ENV !== "production") {
    for (const key of Object.keys(events)) {
      if (isMotionPhaseName(key)) {
        console.error(
          `[burne-ui] createMotionEvents: "${key}" is a built-in phase; use a namespaced name (checkout:saving)`,
        );
      }
    }
  }
  return events;
}

export function splitMotionRootMap(
  motion: MotionRootInput | undefined,
): { slots: MotionSlotMap | undefined; events: MotionEvents | undefined } {
  if (!motion) return { slots: undefined, events: undefined };
  const { events, ...rest } = motion;
  const slots = rest as MotionSlotMap;
  if (process.env.NODE_ENV !== "production") warnSilentSlotKeys(slots);
  return {
    slots: Object.keys(slots).length > 0 ? slots : undefined,
    events,
  };
}

function warnSilentSlotKeys(slots: MotionSlotMap): void {
  for (const [slot, part] of Object.entries(slots)) {
    if (!part || typeof part !== "object") continue;
    for (const key of Object.keys(part)) {
      if (PHASE_SET.has(key)) continue;
      console.error(
        `[burne-ui] motion.${slot}.${key} is not a MotionPhaseName; app commands belong on motion.events (e.g. "checkout:saving")`,
      );
    }
  }
}
