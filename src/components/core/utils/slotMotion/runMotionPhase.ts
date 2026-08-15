import { gsap, killMotion } from "@/components/core/utils/gsapMotion";
import {
  getMotionConfig,
  isMotionEnabledFor,
  type MotionConfig,
} from "@/components/core/utils/motionConfig";
import { prefersReducedMotion } from "@/components/core/utils/reducedMotion";

import { getMotionRecipe } from "./motionRecipeRegistry";
import {
  isMotionFactory,
  isMotionVarsObject,
  LEAVE_COMPLETE_FALLBACK_MS,
  type MotionAnimation,
  type MotionCancelReason,
  type MotionContext,
  type MotionPhaseName,
  type MotionRecipeParams,
  type MotionRun,
  type MotionRunStatus,
  type MotionValue,
  type MotionVars,
} from "./slotMotionTypes";

const running = new WeakMap<HTMLElement, MotionRun>();

let nextRunId = 1;

const VARS_KEYS = ["x", "y", "scale", "autoAlpha"] as const;

export function killStoredMotion(
  el: HTMLElement,
  reason: MotionCancelReason = "killed",
): void {
  const run = running.get(el);
  if (run) {
    run.cancel(reason);
    return;
  }
  killMotion(el);
}

function varsHaveTransform(vars: MotionVars): boolean {
  return VARS_KEYS.some((key) => vars[key] !== undefined);
}

/** `{ recipe: false }` with no transform keys is the same as `false` — skip without kill. */
function isSilentDisable(value: MotionValue): boolean {
  return isMotionVarsObject(value) && value.recipe === false && !varsHaveTransform(value);
}

function pickVars(vars: MotionVars): Partial<MotionVars> {
  const out: Partial<MotionVars> = {};
  for (const key of VARS_KEYS) {
    if (vars[key] !== undefined) out[key] = vars[key];
  }
  return out;
}

function applyMotionVars(
  el: HTMLElement,
  vars: MotionVars,
  reduced: boolean,
  cfg: Readonly<MotionConfig>,
): MotionAnimation | undefined {
  const props = pickVars(vars);
  if (Object.keys(props).length === 0) return undefined;

  if (reduced) {
    gsap.set(el, { ...props, force3D: false });
    return undefined;
  }

  return gsap.to(el, {
    ...props,
    duration: vars.duration ?? cfg.interactiveDuration / 1000,
    ease: vars.ease ?? cfg.interactiveEase,
    overwrite: "auto",
    force3D: false,
  }) as unknown as MotionAnimation;
}

type PhaseRun = {
  run: MotionRun;
  settle: (next: MotionRunStatus, options?: { invokeComplete?: boolean }) => void;
  resolveWait: () => void;
  setAnimation: (animation: MotionAnimation | undefined) => void;
  addCleanup: (fn: () => void) => void;
  signal: AbortSignal;
};

function createPhaseRun(
  el: HTMLElement | null | undefined,
  waitForComplete: boolean,
  userComplete?: () => void,
): PhaseRun {
  const id = nextRunId++;
  const abort = new AbortController();
  let status: MotionRunStatus = "running";
  let animation: MotionAnimation | undefined;
  let cancelReason: MotionCancelReason | undefined;
  const cleanups: Array<() => void> = [];
  let waitResolved = false;
  let resolveFinished: () => void = () => {};
  const finished = new Promise<void>((resolve) => {
    resolveFinished = resolve;
  });

  const resolveWait = () => {
    if (waitResolved) return;
    waitResolved = true;
    resolveFinished();
  };

  const runCleanup = () => {
    while (cleanups.length > 0) {
      cleanups.pop()?.();
    }
  };

  const detach = () => {
    if (el && running.get(el) === run) running.delete(el);
  };

  const abortIfNeeded = () => {
    if (!abort.signal.aborted) abort.abort();
  };

  const settle = (next: MotionRunStatus, options?: { invokeComplete?: boolean }) => {
    if (status !== "running") return;
    status = next;
    if (next === "cancelled") abortIfNeeded();
    runCleanup();
    if (waitForComplete || next !== "finished") detach();
    if (options?.invokeComplete && next !== "cancelled") userComplete?.();
    resolveWait();
  };

  const run: MotionRun = {
    id,
    get status() {
      return status;
    },
    finished,
    get animation() {
      return animation;
    },
    get cancelReason() {
      return cancelReason;
    },
    cancel: (reason: MotionCancelReason = "killed") => {
      abortIfNeeded();
      if (status === "running") {
        cancelReason = reason;
        animation?.kill();
        settle("cancelled");
      } else {
        animation?.kill();
        runCleanup();
        detach();
      }
      if (el) killMotion(el);
    },
    cleanup: runCleanup,
    isCurrent: () => Boolean(el && running.get(el) === run),
  };

  return {
    run,
    settle,
    resolveWait,
    setAnimation: (next) => {
      animation = next;
    },
    addCleanup: (fn) => {
      cleanups.push(fn);
    },
    signal: abort.signal,
  };
}

function hookAnimationComplete(animation: MotionAnimation, onComplete: () => void): void {
  if (typeof animation.eventCallback !== "function") {
    onComplete();
    return;
  }
  const prev = animation.eventCallback("onComplete");
  animation.eventCallback("onComplete", function (this: unknown, ...args: unknown[]) {
    if (typeof prev === "function") {
      (prev as (this: unknown, ...a: unknown[]) => unknown).apply(this, args);
    }
    onComplete();
  });
}

export type RunMotionPhaseOptions = {
  el: HTMLElement | null | undefined;
  phase: MotionPhaseName;
  value: MotionValue | undefined;
  targets: Record<string, HTMLElement | null>;
  getTarget?: (slot: string) => HTMLElement | null;
  getTargets?: (slot: string) => readonly HTMLElement[];
  params?: MotionRecipeParams;
  complete?: () => void;
  waitForComplete?: boolean;
  slot?: string;
  config?: Readonly<MotionConfig>;
};

function warnLeaveFallback(slot: string | undefined): void {
  if (process.env.NODE_ENV === "production") return;
  const label = slot ? `slot "${slot}"` : "motion";
  console.warn(
    `[burne-ui] ${label} leave factory did not return a tween/Promise or call complete(); falling back in ${LEAVE_COMPLETE_FALLBACK_MS}ms`,
  );
}

function warnUnknownRecipe(
  name: string,
  slot: string | undefined,
  phase: MotionPhaseName,
): void {
  if (process.env.NODE_ENV === "production") return;
  const where = slot ? `slot "${slot}", phase "${phase}"` : `phase "${phase}"`;
  console.error(`[burne-ui] unknown motion recipe "${name}" (${where})`);
}

function warnMotionProducerError(
  error: unknown,
  meta: {
    recipe?: string;
    slot?: string;
    phase: MotionPhaseName;
    kind: "threw" | "rejected";
  },
): void {
  if (process.env.NODE_ENV === "production") return;
  const where = meta.slot
    ? `slot "${meta.slot}", phase "${meta.phase}"`
    : `phase "${meta.phase}"`;
  const who = meta.recipe ? `recipe "${meta.recipe}"` : "motion factory";
  const detail = error instanceof Error ? error.message : String(error);
  console.error(`[burne-ui] ${who} ${meta.kind} (${where}): ${detail}`);
}

/**
 * Play one phase on one element. A new play cancels the previous run on that
 * element and always settles its `finished` (it does not hang).
 * `false` skips the phase without killing, so a host slot can drive this target.
 */
export function runMotionPhase({
  el,
  phase,
  value,
  targets,
  getTarget,
  getTargets,
  params = {},
  complete,
  waitForComplete = false,
  slot,
  config,
}: RunMotionPhaseOptions): MotionRun {
  const phaseRun = createPhaseRun(el, waitForComplete, complete);
  const { run, settle, resolveWait, setAnimation, addCleanup, signal } = phaseRun;

  const finishSuccess = () => {
    if (signal.aborted) return;
    settle("finished", { invokeComplete: true });
  };

  if (!el || value === undefined) {
    if (waitForComplete) finishSuccess();
    else resolveWait();
    return run;
  }

  // `false` disables this slot's phase. Do not kill — another slot may be
  // orchestrating this same target (fill factory → mark).
  if (value === false || isSilentDisable(value)) {
    if (waitForComplete) finishSuccess();
    else resolveWait();
    return run;
  }

  killStoredMotion(el, "superseded");
  running.set(el, run);

  // Snapshot at play start: config / reduced-motion changes apply to the next
  // play, not this run (see motion docs — “new runs only”).
  const cfg = config ?? getMotionConfig();
  const reduced = prefersReducedMotion() || !isMotionEnabledFor(cfg);

  const ctx: MotionContext = {
    el,
    phase,
    targets,
    getTarget: getTarget ?? ((name) => targets[name] ?? null),
    getTargets:
      getTargets ??
      ((name) => {
        const node = targets[name];
        return node ? [node] : [];
      }),
    complete: finishSuccess,
    kill: () => killStoredMotion(el, "killed"),
    reduced,
    config: cfg,
    params,
    runId: run.id,
    isCurrent: run.isCurrent,
    signal,
    onCleanup: addCleanup,
  };

  const runRecipe = (name: string, extraParams?: MotionRecipeParams) => {
    const recipe = getMotionRecipe(name);
    if (!recipe) {
      warnUnknownRecipe(name, slot, phase);
      if (waitForComplete) finishSuccess();
      else resolveWait();
      return undefined;
    }
    const recipeCtx = extraParams ? { ...ctx, params: { ...params, ...extraParams } } : ctx;
    return recipe(recipeCtx);
  };

  let animation: MotionAnimation | undefined;
  let pending: Promise<void> | undefined;
  let recipeNameForError: string | undefined;

  try {
    if (isMotionFactory(value)) {
      const result = value(ctx);
      if (result && typeof result === "object" && "then" in result) {
        pending = result;
      } else if (result && typeof result === "object" && "kill" in result) {
        animation = result as MotionAnimation;
      }
    } else if (typeof value === "string") {
      recipeNameForError = value;
      const result = runRecipe(value);
      if (result && typeof result === "object" && "then" in result) {
        pending = result;
      } else if (result && typeof result === "object" && "kill" in result) {
        animation = result as MotionAnimation;
      }
    } else if (isMotionVarsObject(value)) {
      const recipeName = value.recipe;
      const timingParams = {
        ...(value.duration !== undefined ? { duration: value.duration } : {}),
        ...(value.ease !== undefined ? { ease: value.ease } : {}),
      };
      if (typeof recipeName === "string") {
        recipeNameForError = recipeName;
        const result = runRecipe(recipeName, timingParams);
        if (result && typeof result === "object" && "then" in result) {
          pending = result;
        } else if (result && typeof result === "object" && "kill" in result) {
          animation = result as MotionAnimation;
        }
      } else {
        animation = applyMotionVars(el, value, reduced, cfg);
      }
    }
  } catch (error) {
    warnMotionProducerError(error, {
      recipe: recipeNameForError,
      slot,
      phase,
      kind: "threw",
    });
    settle("failed", { invokeComplete: true });
    return run;
  }

  if (run.status !== "running") {
    animation?.kill();
    return run;
  }

  setAnimation(animation);
  if (animation) {
    if (waitForComplete) {
      hookAnimationComplete(animation, finishSuccess);
    }
  }

  if (
    waitForComplete &&
    animation &&
    typeof animation.repeat === "function" &&
    animation.repeat() === -1 &&
    process.env.NODE_ENV !== "production"
  ) {
    const label = slot ? `slot "${slot}"` : "motion";
    console.warn(
      `[burne-ui] ${label} leave returned a repeating tween; call ctx.complete() or return a finite tween so the portal can unmount`,
    );
  }

  if (pending) {
    void pending.then(
      () => {
        if (signal.aborted || run.status !== "running" || !run.isCurrent()) return;
        if (waitForComplete) finishSuccess();
        else resolveWait();
      },
      (error) => {
        if (signal.aborted || run.status !== "running" || !run.isCurrent()) return;
        warnMotionProducerError(error, {
          recipe: recipeNameForError,
          slot,
          phase,
          kind: "rejected",
        });
        settle("failed", { invokeComplete: true });
      },
    );
    return run;
  }

  if (waitForComplete) {
    if (animation) {
      // onComplete hooked above
    } else if (isMotionFactory(value)) {
      warnLeaveFallback(slot);
      const timeoutId = globalThis.setTimeout(finishSuccess, LEAVE_COMPLETE_FALLBACK_MS);
      addCleanup(() => globalThis.clearTimeout(timeoutId));
    } else {
      finishSuccess();
    }
  } else {
    resolveWait();
  }

  return run;
}
