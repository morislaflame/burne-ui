import { isMotionHostLifecyclePhase, type MotionRun } from "./slotMotionTypes";
 
export type WaitForLeaveGenerationOptions = {
  runs: readonly MotionRun[];
  extra?: Promise<void>;
  onComplete: () => void;
  onKill?: () => void;
};
 
/**
 * `enter` / a newer `leave` (reopen or a new close generation) must not unmount.
 * A foreign phase that cancelled leave must not freeze the host in the stack.
 */
export function leaveCancelBlocksUnmount(run: MotionRun): boolean {
  if (run.status === "running") return true;
  if (run.status !== "cancelled") return false;
  if (run.cancelReason !== "superseded") return true;
  return run.supersededBy == null || isMotionHostLifecyclePhase(run.supersededBy);
}
 
/**
 * Wait for the **current** leave generation. Cancellation by `enter` / `leave`
 * (or host kill) is not a successful leave. Cancellation by a foreign phase is.
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
    if (runs.some(leaveCancelBlocksUnmount)) return;
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
 