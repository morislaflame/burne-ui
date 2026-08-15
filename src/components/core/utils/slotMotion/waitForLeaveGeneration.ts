import type { MotionRun } from "./slotMotionTypes";

export type WaitForLeaveGenerationOptions = {
  runs: readonly MotionRun[];
  extra?: Promise<void>;
  onComplete: () => void;
  onKill?: () => void;
};

/**
 * Wait for the **current** leave generation. Cancellation settles `finished`
 * but is not a successful leave — the host must not unmount / complete close.
 */
export function waitForLeaveGeneration({
  runs,
  extra,
  onComplete,
  onKill,
}: WaitForLeaveGenerationOptions): { kill: () => void } {
  let cancelled = false;
  void Promise.all([extra ?? Promise.resolve(), ...runs.map((run) => run.finished)]).then(() => {
    if (cancelled) return;
    if (runs.some((run) => run.status === "cancelled" || run.status === "running")) return;
    onComplete();
  });
  return {
    kill: () => {
      cancelled = true;
      for (const run of runs) run.cancel("host");
      onKill?.();
    },
  };
}
