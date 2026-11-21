import {
  isMotionPhaseName,
  MOTION_PHASE_NAMES,
  type MotionContext,
  type MotionFactory,
  type MotionPartPhases,
  type MotionSlotMap,
  type MotionValue,
} from "./slotMotionTypes";
 
const PHASE_SET = new Set<string>(MOTION_PHASE_NAMES);
 
/** App commands on `motion.events`. Do not use `MotionPhaseName` keys. */
export type MotionEvents<TEvent extends string = string> = {
  [K in TEvent]?: MotionValue;
};
 
/** Per-slot values for one app mode (`idle` / `loading`). Not phases. */
export type MotionStateSlots = {
  [slot: string]: MotionValue | undefined;
};
 
/**
 * App modes on `motion.states`. Sibling of slots and `events`.
 * Do not use `MotionPhaseName` keys (`idle` is fine; `hoverIn` is not).
 */
export type MotionStates<TState extends string = string> = {
  [K in TState]?: MotionStateSlots;
};
 
/**
 * Host props for declarative modes. Destructure before `...rest` (not on the DOM).
 * Pair with `motion.states`. Same `motionState` again does not replay.
 * Generic `TPayload` types `motionPayload`; kit hosts stay at the default `unknown`.
 */
export type MotionStateHostProps<TPayload = unknown> = {
  /**
   * App mode (`idle` / `loading` / `success`). Not a `MotionPhaseName`.
   * The same value again is a no-op; change it to play `motion.states[name]`.
   */
  motionState?: string;
  /**
   * Snapshot for the transition factory (`ctx.payload`). Suggested fields:
   * `MotionPayload`. Read it inside `createMotionFactory` — do not close over
   * React state from `createMotionStates`. Updating this without changing
   * `motionState` does not replay. Plain objects / arrays are copied and frozen.
   */
  motionPayload?: TPayload;
  /**
   * Play `motion.states[motionState]` on mount. Default skip so first paint stays CSS rest.
   */
  playInitialState?: boolean;
};
 
/** Slot map plus sibling `events` / `states` (not DOM slots). */
export type MotionMapWithEvents<TSlots extends object> = TSlots & {
  events?: MotionEvents;
  states?: MotionStates;
};
 
/**
 * Root `motion` including optional `events` / `states`. Open index cannot be `MotionSlotMap`
 * (`events` values are `MotionValue`; `states` values are per-slot maps).
 */
export type MotionRootInput = {
  [slot: string]: MotionPartPhases | MotionEvents | MotionStates | undefined;
  events?: MotionEvents;
  states?: MotionStates;
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
 
/**
 * Identity helper for `motion.states` (`idle` / `loading` / `success`).
 * Built-in phase names as keys are a type error and a dev `console.error`.
 */
export function createMotionStates<const T extends Record<string, MotionStateSlots>>(
  states: NoPhaseKeys<T>,
): T {
  if (process.env.NODE_ENV !== "production") {
    for (const key of Object.keys(states)) {
      if (isMotionPhaseName(key)) {
        console.error(
          `[burne-ui] createMotionStates: "${key}" is a built-in phase; use an app mode (idle / loading)`,
        );
      }
    }
  }
  return states;
}
 
/**
 * Typed factory for `motion.states` / `motion.events`. `MotionValue` sees
 * `MotionContext` (`payload` unknown); this wrapper types `ctx.payload`.
 * Kit `params` stay `MotionRecipeParams` — do not put app fields there.
 */
export function createMotionFactory<TPayload = unknown>(
  fn: (ctx: MotionContext<TPayload>) => ReturnType<MotionFactory>,
): MotionFactory {
  return (ctx) => fn(ctx as MotionContext<TPayload>);
}
 
export function splitMotionRootMap(motion: MotionRootInput | undefined): {
  slots: MotionSlotMap | undefined;
  events: MotionEvents | undefined;
  states: MotionStates | undefined;
} {
  if (!motion) return { slots: undefined, events: undefined, states: undefined };
  const { events, states, ...rest } = motion;
  const slots = rest as MotionSlotMap;
  if (process.env.NODE_ENV !== "production") warnSilentSlotKeys(slots);
  return {
    slots: Object.keys(slots).length > 0 ? slots : undefined,
    events,
    states,
  };
}
 
/** Per-mode slot maps; `override` wins on the same slot. */
export function mergeMotionStates(
  base?: MotionStates,
  override?: MotionStates,
): MotionStates | undefined {
  if (!base) return override;
  if (!override) return base;
  const out: MotionStates = { ...base };
  for (const [name, slots] of Object.entries(override)) {
    out[name] = { ...base[name], ...slots };
  }
  return out;
}
 
/**
 * Nested host sibling merge (`events` / `states`). Local wins.
 * Empty objects are omitted so callers can spread onto a slot map.
 */
export function mergeMotionRootSiblings(
  parent?: { events?: MotionEvents; states?: MotionStates },
  local?: { events?: MotionEvents; states?: MotionStates },
): { events?: MotionEvents; states?: MotionStates } {
  const events =
    parent?.events || local?.events ? { ...parent?.events, ...local?.events } : undefined;
  const states = mergeMotionStates(parent?.states, local?.states);
  return {
    ...(events && Object.keys(events).length > 0 ? { events } : {}),
    ...(states && Object.keys(states).length > 0 ? { states } : {}),
  };
}
 
/** Rename slots inside each mode (`indicator` → `root` for SelectionIndicator). */
export function remapMotionStateSlots(
  states: MotionStates | undefined,
  slotMap: Record<string, string>,
): MotionStates | undefined {
  if (!states) return undefined;
  const dest = new Set(Object.values(slotMap));
  const out: MotionStates = {};
  for (const [mode, slots] of Object.entries(states)) {
    if (!slots) continue;
    const next: MotionStateSlots = {};
    for (const [slot, value] of Object.entries(slots)) {
      if (value === undefined) continue;
      const mapped = slotMap[slot] ?? (dest.has(slot) ? slot : undefined);
      if (!mapped) continue;
      next[mapped] = value;
    }
    if (Object.keys(next).length > 0) out[mode] = next;
  }
  return Object.keys(out).length > 0 ? out : undefined;
}
 
function warnSilentSlotKeys(slots: MotionSlotMap): void {
  for (const [slot, part] of Object.entries(slots)) {
    if (isMotionPhaseName(slot)) {
      console.error(
        `[burne-ui] motion.${slot} is a phase, not a slot; use motion.root.${slot} (or the host slot). Root shorthand motion={{ ${slot} }} is ignored.`,
      );
      continue;
    }
    if (!part || typeof part !== "object") continue;
    for (const key of Object.keys(part)) {
      if (PHASE_SET.has(key)) continue;
      console.error(
        `[burne-ui] motion.${slot}.${key} is not a MotionPhaseName; app commands belong on motion.events (e.g. "checkout:saving"); modes belong on motion.states`,
      );
    }
  }
}
 