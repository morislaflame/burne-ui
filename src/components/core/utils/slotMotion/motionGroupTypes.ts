import type {
  MotionCancelReason,
  MotionRun,
  MotionTimelinePosition,
  MotionTransformVars,
} from "./slotMotionTypes";
import type {
  MotionController,
  MotionPlayEvent,
  MotionPlayOptions,
  MotionRunResult,
} from "./motionControllerTypes";
 
/**
 * `playAll` on a group broadcasts to **members** (one `play` each, default slot `root`).
 * Slot-level `exclude` stays on the child controller. `stagger` is seconds between members.
 */
export type MotionGroupPlayAllOptions = {
  members?: readonly string[];
  /** Forwarded to each member `play`. Default `"root"`. */
  slot?: string;
  stagger?: number;
  waitForComplete?: boolean;
  signal?: AbortSignal;
};
 
export type MotionGroupTimelinePlayOptions = MotionPlayOptions & {
  position?: MotionTimelinePosition;
};
 
export type MotionGroupTimelinePlayAllOptions = MotionGroupPlayAllOptions & {
  position?: MotionTimelinePosition;
};
 
/**
 * Scheduler over registered members — GSAP positions (`0`, `"+=0.12"`), not a second tween engine.
 * `kill()` aborts remaining callbacks and cancels runs this timeline started.
 */
export type MotionGroupTimeline<TEvent extends string = string & {}> = {
  play(
    id: string,
    event: MotionPlayEvent<TEvent>,
    options?: MotionGroupTimelinePlayOptions,
  ): MotionGroupTimeline<TEvent>;
  playSlot(
    id: string,
    slot: string,
    event: MotionPlayEvent<TEvent>,
    options?: MotionGroupTimelinePlayOptions,
  ): MotionGroupTimeline<TEvent>;
  playAll(
    event: MotionPlayEvent<TEvent>,
    options?: MotionGroupTimelinePlayAllOptions,
  ): MotionGroupTimeline<TEvent>;
  set(
    id: string,
    slot: string,
    vars: MotionTransformVars,
    position?: MotionTimelinePosition,
  ): MotionGroupTimeline<TEvent>;
  call(fn: () => void, position?: MotionTimelinePosition): MotionGroupTimeline<TEvent>;
  kill(): void;
};
 
/**
 * Registry of child `MotionController` handles by string id.
 * Not a `motionId` prop on kit roots — the app registers existing handles.
 * Targets come from the child controller; there is no DOM selector API.
 */
export type MotionGroup<TEvent extends string = string & {}> = {
  register(id: string, controller: MotionController<string>): () => void;
  unregister(id: string): void;
  has(id: string): boolean;
  get(id: string): MotionController<string> | null;
  ids(): readonly string[];
  getTarget(id: string, slot: string): HTMLElement | null;
  getTargets(id: string, slot: string): readonly HTMLElement[];
  play(id: string, event: MotionPlayEvent<TEvent>, options?: MotionPlayOptions): MotionRun;
  playSlot(
    id: string,
    slot: string,
    event: MotionPlayEvent<TEvent>,
    options?: MotionPlayOptions,
  ): MotionRun;
  playAll(
    event: MotionPlayEvent<TEvent>,
    options?: MotionGroupPlayAllOptions,
  ): Promise<MotionRunResult>;
  set(id: string, slot: string, vars: MotionTransformVars): void;
  /** Omit `id` to cancel every member. */
  cancel(id?: string, slot?: string, reason?: MotionCancelReason): void;
  timeline(): MotionGroupTimeline<TEvent>;
};
 