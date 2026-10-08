import {
  getMotionConfig,
  isMotionEnabledFor,
  type MotionConfig,
} from "@/components/core/utils/motionConfig";
import { prefersReducedMotion } from "@/components/core/utils/reducedMotion";

import type { MotionRegistration } from "./createMotionRegistry";
import { getMotionRecipe } from "./motionRecipeRegistry";
import { createMotionSurfaceApi } from "./motionSurface";
import { createMotionTweenApi, playDeclarativeMotion } from "./motionTween";
import { registerKitMotionRecipes } from "./recipes";
import {
  isMotionAbortError,
  isMotionFactory,
  isMotionVarsObject,
  type MotionContext,
  type MotionPartPhases,
  type MotionRecipeParams,
  type MotionRun,
  type MotionValue,
} from "./slotMotionTypes";

const TRANSFORM_KEYS = ["x", "y", "scale", "autoAlpha"] as const;

type MountBinding = {
  node: HTMLElement;
  value: MotionValue;
  cleanups: Array<() => void>;
  abort: AbortController;
};

function isInactiveMount(value: MotionValue | undefined): boolean {
  if (value === undefined || value === false) return true;
  if (!isMotionVarsObject(value) || value.recipe !== false) return false;
  return TRANSFORM_KEYS.every((key) => value[key] === undefined);
}

function warnMountError(
  error: unknown,
  slot: string,
  kind: "threw" | "rejected",
  recipe?: string,
): void {
  if (process.env.NODE_ENV === "production") return;
  const who = recipe ? `recipe "${recipe}"` : "motion factory";
  const detail = error instanceof Error ? error.message : String(error);
  console.error(
    `[burne-ui] ${who} ${kind} (slot "${slot}", phase "mount"): ${detail}`,
  );
}

/**
 * Element-lifetime `mount`. Cleanups stay until this registration drops the
 * node. They are not the run cleanups of hover / press / enter.
 */
export function createSlotMounts(options: {
  resolve: (slot: string, partMotion?: MotionPartPhases) => MotionValue | undefined;
  getParams: () => MotionRecipeParams;
  getConfig?: () => Readonly<MotionConfig> | undefined;
  getTarget: (slot: string) => HTMLElement | null;
  getTargets: (slot: string) => readonly HTMLElement[];
}) {
  const bindings = new Map<symbol, MountBinding>();

  const release = (id: symbol) => {
    const binding = bindings.get(id);
    if (!binding) return;
    bindings.delete(id);
    if (!binding.abort.signal.aborted) binding.abort.abort();
    while (binding.cleanups.length > 0) {
      binding.cleanups.pop()?.();
    }
  };

  const attach = (reg: MotionRegistration, value: MotionValue) => {
    const abort = new AbortController();
    const cleanups: Array<() => void> = [];
    const binding: MountBinding = {
      node: reg.node,
      value,
      cleanups,
      abort,
    };
    bindings.set(reg.id, binding);

    const cfg = options.getConfig?.() ?? getMotionConfig();
    const reduced = prefersReducedMotion() || !isMotionEnabledFor(cfg);
    const params = options.getParams();
    let recipeName: string | undefined;

    const ctx = {
      el: reg.node,
      phase: "mount",
      targets: { [reg.slot]: reg.node },
      getTarget: options.getTarget,
      getTargets: options.getTargets,
      complete: () => {},
      kill: () => release(reg.id),
      reduced,
      config: cfg,
      ...createMotionSurfaceApi({ el: reg.node, config: cfg }),
      params,
      runId: 0,
      isCurrent: () => bindings.get(reg.id) === binding && !abort.signal.aborted,
      signal: abort.signal,
      onCleanup: (fn: () => void) => {
        cleanups.push(fn);
      },
      onInterrupt: () => {},
      onError: () => {},
      ...createMotionTweenApi({
        el: reg.node,
        phase: "mount",
        reduced,
        config: cfg,
        onCleanup: (fn) => {
          cleanups.push(fn);
        },
        setAnimation: () => {},
        signal: abort.signal,
      }),
    } satisfies MotionContext;

    const runRecipe = (name: string, extra?: MotionRecipeParams) => {
      registerKitMotionRecipes();
      const recipe = getMotionRecipe(name);
      if (!recipe) {
        if (process.env.NODE_ENV !== "production") {
          console.error(
            `[burne-ui] unknown motion recipe "${name}" (slot "${reg.slot}", phase "mount")`,
          );
        }
        return undefined;
      }
      const recipeCtx = extra ? { ...ctx, params: { ...params, ...extra } } : ctx;
      return recipe(recipeCtx);
    };

    const watch = (result: unknown) => {
      if (!result || typeof result !== "object" || !("then" in result)) return;
      void Promise.resolve(result).then(
        () => {},
        (error: unknown) => {
          if (abort.signal.aborted || isMotionAbortError(error)) return;
          warnMountError(error, reg.slot, "rejected", recipeName);
        },
      );
    };

    try {
      if (isMotionFactory(value)) {
        watch(value(ctx));
        return;
      }
      if (typeof value === "string") {
        recipeName = value;
        watch(runRecipe(value));
        return;
      }
      if (isMotionVarsObject(value)) {
        if (typeof value.recipe === "string") {
          recipeName = value.recipe;
          const timing = {
            ...(value.duration !== undefined ? { duration: value.duration } : {}),
            ...(value.ease !== undefined ? { ease: value.ease } : {}),
          };
          watch(runRecipe(value.recipe, timing));
          return;
        }
        const animation = playDeclarativeMotion(reg.node, value, {
          phase: "mount",
          reduced,
          config: cfg,
        });
        if (animation) cleanups.push(() => animation.kill());
      }
    } catch (error) {
      warnMountError(error, reg.slot, "threw", recipeName);
    }
  };

  const sync = (reg: MotionRegistration) => {
    const value = options.resolve(reg.slot, reg.motion);
    const prev = bindings.get(reg.id);
    if (prev && prev.node === reg.node && Object.is(prev.value, value)) return;
    if (value === undefined || isInactiveMount(value)) {
      if (prev) release(reg.id);
      return;
    }
    if (prev) release(reg.id);
    attach(reg, value);
  };

  return { sync, release };
}

/** `play("mount")` must not enter the per-element run map or flush element cleanups. */
export function settledMountRun(): MotionRun {
  return {
    id: 0,
    phase: "mount",
    status: "finished",
    finished: Promise.resolve(),
    animation: undefined,
    cancel: () => {},
    cleanup: () => {},
    isCurrent: () => false,
  };
}
