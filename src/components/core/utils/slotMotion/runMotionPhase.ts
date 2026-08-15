import { gsap, killMotion } from "@/components/core/utils/gsapMotion";
import { getMotionConfig, isMotionEnabled } from "@/components/core/utils/motionConfig";
import { prefersReducedMotion } from "@/components/core/utils/reducedMotion";

import { getMotionRecipe } from "./motionRecipeRegistry";
import {
  isMotionFactory,
  isMotionVarsObject,
  LEAVE_COMPLETE_FALLBACK_MS,
  type MotionAnimation,
  type MotionContext,
  type MotionValue,
  type MotionVars,
} from "./slotMotionTypes";

const running = new WeakMap<HTMLElement, MotionAnimation>();

const VARS_KEYS = ["x", "y", "scale", "autoAlpha"] as const;

export function killStoredMotion(el: HTMLElement): void {
  const anim = running.get(el);
  if (anim) {
    anim.kill();
    running.delete(el);
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
): MotionAnimation | undefined {
  const props = pickVars(vars);
  if (Object.keys(props).length === 0) return undefined;

  const cfg = getMotionConfig();
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

function storeAndHookComplete(
  el: HTMLElement,
  animation: MotionAnimation | undefined,
  completeOnce: () => void,
  waitForComplete: boolean,
): void {
  if (!animation) return;
  running.set(el, animation);
  if (!waitForComplete) return;
  if (typeof animation.eventCallback !== "function") {
    completeOnce();
    return;
  }
  const prev = animation.eventCallback("onComplete");
  animation.eventCallback("onComplete", function (this: unknown, ...args: unknown[]) {
    running.delete(el);
    if (typeof prev === "function") {
      (prev as (this: unknown, ...a: unknown[]) => unknown).apply(this, args);
    }
    completeOnce();
  });
}

export type RunMotionPhaseOptions = {
  el: HTMLElement | null | undefined;
  phase: string;
  value: MotionValue | undefined;
  targets: Record<string, HTMLElement | null>;
  params?: Record<string, unknown>;
  complete?: () => void;
  waitForComplete?: boolean;
  slot?: string;
};

export type RunMotionPhaseResult = {
  animation: MotionAnimation | undefined;
  finished: Promise<void>;
};

function warnLeaveFallback(slot: string | undefined): void {
  if (process.env.NODE_ENV === "production") return;
  const label = slot ? `slot "${slot}"` : "motion";
  console.warn(
    `[burne-ui] ${label} leave factory did not return a tween/Promise or call complete(); falling back in ${LEAVE_COMPLETE_FALLBACK_MS}ms`,
  );
}

/**
 * Play one phase on one element. A new play kills the previous tween on that element.
 * `false` skips the phase without killing, so a host slot can drive this target.
 */
export function runMotionPhase({
  el,
  phase,
  value,
  targets,
  params = {},
  complete,
  waitForComplete = false,
  slot,
}: RunMotionPhaseOptions): RunMotionPhaseResult {
  let settled = false;
  let resolveFinished: () => void = () => {};
  const finished = new Promise<void>((resolve) => {
    resolveFinished = resolve;
  });

  const completeOnce = () => {
    if (settled) return;
    settled = true;
    complete?.();
    resolveFinished();
  };

  const finishNow = () => {
    completeOnce();
  };

  if (!el || value === undefined) {
    if (waitForComplete) finishNow();
    else resolveFinished();
    return { animation: undefined, finished };
  }

  // `false` disables this slot's phase. Do not kill — another slot may be
  // orchestrating this same target (fill factory → mark).
  if (value === false || isSilentDisable(value)) {
    if (waitForComplete) finishNow();
    else resolveFinished();
    return { animation: undefined, finished };
  }

  killStoredMotion(el);

  const reduced = prefersReducedMotion() || !isMotionEnabled();
  const cfg = getMotionConfig();

  const ctx: MotionContext = {
    el,
    phase,
    targets,
    complete: completeOnce,
    kill: () => killStoredMotion(el),
    reduced,
    config: cfg,
    params,
  };

  const runRecipe = (name: string, extraParams?: Record<string, unknown>) => {
    const recipe = getMotionRecipe(name);
    if (!recipe) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`[burne-ui] unknown motion recipe "${name}"`);
      }
      if (waitForComplete) finishNow();
      else resolveFinished();
      return undefined;
    }
    const recipeCtx = extraParams ? { ...ctx, params: { ...params, ...extraParams } } : ctx;
    return recipe(recipeCtx);
  };

  let animation: MotionAnimation | undefined;
  let pending: Promise<void> | undefined;

  if (isMotionFactory(value)) {
    const result = value(ctx);
    if (result && typeof result === "object" && "then" in result) {
      pending = result;
    } else if (result && typeof result === "object" && "kill" in result) {
      animation = result as MotionAnimation;
    }
  } else if (typeof value === "string") {
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
      const result = runRecipe(recipeName, timingParams);
      if (result && typeof result === "object" && "then" in result) {
        pending = result;
      } else if (result && typeof result === "object" && "kill" in result) {
        animation = result as MotionAnimation;
      }
    } else {
      animation = applyMotionVars(el, value, reduced);
    }
  }

  storeAndHookComplete(el, animation, completeOnce, waitForComplete);

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
        if (waitForComplete) completeOnce();
        else resolveFinished();
      },
      () => {
        if (waitForComplete) completeOnce();
        else resolveFinished();
      },
    );
    return { animation, finished };
  }

  if (waitForComplete) {
    if (animation) {
      // onComplete hooked in storeAndHookComplete
    } else if (isMotionFactory(value)) {
      warnLeaveFallback(slot);
      window.setTimeout(completeOnce, LEAVE_COMPLETE_FALLBACK_MS);
    } else {
      finishNow();
    }
  } else {
    resolveFinished();
  }

  return { animation, finished };
}
