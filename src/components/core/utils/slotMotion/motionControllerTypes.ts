import type {
  MotionCancelReason,
  MotionPhaseName,
  MotionRun,
  MotionRunStatus,
  MotionTransformVars,
  MotionValue,
} from "./slotMotionTypes";

export type MotionPlayOptions = {
  /** Unique / first instance. Default for `play()` is `"root"`. */
  slot?: string;
  /** Repeated slot: this DOM node. Otherwise `getTarget(slot)`. */
  el?: HTMLElement | null;
  waitForComplete?: boolean;
  /** External abort — cancels the run (`killed`). */
  signal?: AbortSignal;
  /** Override the resolved phase value (tests / W3.2 events). */
  value?: MotionValue;
};

export type MotionBroadcastOptions = {
  exclude?: readonly string[];
  waitForComplete?: boolean;
  signal?: AbortSignal;
  /**
   * Delay between instance starts, in **seconds** (GSAP-style).
   * `0` / omit — all plays start in registration order with no delay.
   */
  stagger?: number;
};

export type MotionRunResult = {
  runs: readonly MotionRun[];
};

/**
 * Argument to `play` / `playSlot` / `playAll`.
 * Default `TEvent` is `string & {}`: lifecycle phases stay in autocomplete, and
 * namespaced app events (`checkout:saving`) type-check without a generic.
 * `never` (empty generic inference) is treated as the same loose default.
 * Pass `keyof typeof events` to reject unknown event names; phases stay in the union.
 */
export type MotionPlayEvent<TEvent extends string = string & {}> = [TEvent] extends [never]
  ? MotionPhaseName | (string & {})
  : MotionPhaseName | TEvent;

/**
 * App handle over a live motion scope.
 * Built-in phases (`MotionPhaseName`) are always accepted; namespaced app events
 * resolve `motion.events`. Default `TEvent` is loose (`string & {}`).
 */
export type MotionController<TEvent extends string = string & {}> = {
  play(event: MotionPlayEvent<TEvent>, options?: MotionPlayOptions): MotionRun;
  playSlot(slot: string, event: MotionPlayEvent<TEvent>, options?: MotionPlayOptions): MotionRun;
  playAll(
    event: MotionPlayEvent<TEvent>,
    options?: MotionBroadcastOptions,
  ): Promise<MotionRunResult>;
  /** Instant compositor snap. No `MotionRun` / `finished`. */
  set(slot: string, vars: MotionTransformVars): void;
  cancel(slot?: string, reason?: MotionCancelReason): void;
  getTarget(slot: string): HTMLElement | null;
  getTargets(slot: string): readonly HTMLElement[];
};

export type MotionControllerStatus = MotionRunStatus;
