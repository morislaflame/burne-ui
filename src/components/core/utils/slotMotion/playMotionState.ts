import { useLayoutEffect, useRef } from "react";

import type { MotionStates } from "./motionEvents";
import type { MotionValue } from "./slotMotionTypes";

export type MotionStatePlayScope = {
  getStates: () => MotionStates | undefined;
  getTargets: (slot: string) => readonly HTMLElement[];
  play: (
    slot: string,
    name: string,
    options?: {
      partValue?: MotionValue;
      el?: HTMLElement | null;
      fromState?: string;
      toState?: string;
      payload?: unknown;
    },
  ) => unknown;
};

/**
 * Copy taken at the start of a state transition for `ctx.payload`.
 * Plain objects / arrays are shallow-copied and frozen so later mutation of
 * `motionPayload` (or of the snapshot) does not leak into a running factory.
 * Primitives and class instances stay as-is.
 */
export function snapshotMotionPayload<T>(payload: T): T {
  if (payload == null || typeof payload !== "object") return payload;
  if (Array.isArray(payload)) {
    return Object.freeze(payload.slice()) as T;
  }
  const proto = Object.getPrototypeOf(payload);
  if (proto !== Object.prototype && proto !== null) return payload;
  return Object.freeze({ ...(payload as Record<string, unknown>) }) as T;
}

/**
 * First commit: skip unless `playInitial`.
 * Same name: skip (payload-only updates do not replay).
 * Empty `next`: skip (no automatic rest pose).
 */
export function nextMotionStateTransition(
  prev: string | undefined,
  next: string | undefined,
  options: { isFirst: boolean; playInitial: boolean },
): { from: string | undefined; to: string } | null {
  if (next == null || next === "") return null;
  if (options.isFirst) {
    if (!options.playInitial) return null;
    return { from: undefined, to: next };
  }
  if (prev === next) return null;
  return { from: prev, to: next };
}

/** Play every listed slot for `to`. Missing state → skip + dev `console.error`. */
export function playMotionStateTransition(
  scope: MotionStatePlayScope,
  from: string | undefined,
  to: string,
  payload?: unknown,
): void {
  const slots = scope.getStates()?.[to];
  if (!slots) {
    if (process.env.NODE_ENV !== "production") {
      console.error(`[burne-ui] missing motion state "${to}"`);
    }
    return;
  }
  const snap = snapshotMotionPayload(payload);
  for (const [slot, value] of Object.entries(slots)) {
    if (value === undefined || value === false) continue;
    const nodes = scope.getTargets(slot);
    for (const el of nodes) {
      scope.play(slot, to, {
        el,
        partValue: value,
        fromState: from,
        toState: to,
        payload: snap,
      });
    }
  }
}

/**
 * Provider hook: play `motion.states[motionState]` when the mode changes.
 * `payload` is taken from the render that changed the mode, then copied and
 * frozen into `ctx.payload`.
 */
export function useMotionStatePlayback(
  scope: MotionStatePlayScope,
  motionState: string | undefined,
  payload: unknown,
  playInitial = false,
): void {
  const prevRef = useRef<string | undefined>(undefined);
  const initedRef = useRef(false);
  const payloadRef = useRef(payload);
  payloadRef.current = payload;

  useLayoutEffect(() => {
    const isFirst = !initedRef.current;
    initedRef.current = true;
    const prev = prevRef.current;
    const transition = nextMotionStateTransition(prev, motionState, {
      isFirst,
      playInitial,
    });
    prevRef.current = motionState;
    if (!transition) return;
    playMotionStateTransition(scope, transition.from, transition.to, payloadRef.current);
  }, [motionState, playInitial, scope]);
}
