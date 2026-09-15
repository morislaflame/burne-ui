import { gsap } from "@/components/core/utils/gsapMotion";
import type { MotionConfig } from "@/components/core/utils/motionConfig";

import { isMotionPhaseName } from "./slotMotionTypes";
import type {
  MotionAnimation,
  MotionDelay,
  MotionDurationToken,
  MotionPhaseName,
  MotionReplay,
  MotionSequenceStep,
  MotionTimeline,
  MotionTimelinePosition,
  MotionTweenVars,
  MotionVars,
} from "./slotMotionTypes";

const TRANSFORM_KEYS = [
  "x",
  "y",
  "scale",
  "scaleX",
  "scaleY",
  "rotation",
  "rotate",
  "autoAlpha",
  "opacity",
] as const;

const PUBLIC_TRANSFORM_KEYS = ["x", "y", "scale", "autoAlpha"] as const;

export const MOTION_REST_POSE = {
  x: 0,
  y: 0,
  scale: 1,
  scaleX: 1,
  scaleY: 1,
  rotation: 0,
  rotate: 0,
  autoAlpha: 1,
  opacity: 1,
} as const satisfies Record<(typeof TRANSFORM_KEYS)[number], number>;

export type MotionTweenHost = {
  el: HTMLElement;
  phase: MotionPhaseName | (string & {});
  reduced: boolean;
  config: Readonly<MotionConfig>;
  onCleanup: (fn: () => void) => void;
  setAnimation: (animation: MotionAnimation | undefined) => void;
  signal: AbortSignal;
};

export type MotionTweenApi = {
  to: {
    (vars: MotionTweenVars): MotionAnimation | undefined;
    (el: HTMLElement | null | undefined, vars: MotionTweenVars): MotionAnimation | undefined;
  };
  fromRest: {
    (vars: MotionTweenVars): MotionAnimation | undefined;
    (el: HTMLElement | null | undefined, vars: MotionTweenVars): MotionAnimation | undefined;
  };
  fromTo: {
    (from: MotionTweenVars, vars: MotionTweenVars): MotionAnimation | undefined;
    (
      el: HTMLElement | null | undefined,
      from: MotionTweenVars,
      vars: MotionTweenVars,
    ): MotionAnimation | undefined;
  };
  timeline: () => MotionTimeline;
  wait: (delay: MotionDelay) => Promise<void>;
  sequence: (...steps: MotionSequenceStep[]) => Promise<void>;
  parallel: (...steps: MotionSequenceStep[]) => Promise<void>;
};

export function resolveMotionReplay(
  phase: string,
  vars: { replay?: MotionReplay; yoyo?: boolean },
): MotionReplay {
  if (vars.replay === "rest" || vars.replay === "current") return vars.replay;
  if (!isMotionPhaseName(phase) && vars.yoyo) return "rest";
  return "current";
}

export function motionRestVars(vars: MotionTweenVars): MotionTweenVars {
  const from: MotionTweenVars = {};
  for (const key of TRANSFORM_KEYS) {
    if (vars[key] !== undefined) from[key] = MOTION_REST_POSE[key];
  }
  return from;
}

function overwriteFor(phase: string): "auto" | true {
  return isMotionPhaseName(phase) ? "auto" : true;
}

const MOTION_DURATION_TOKENS: readonly MotionDurationToken[] = [
  "interactiveDuration",
  "tooltipDuration",
  "modalDuration",
  "switchThumbDuration",
  "selectionFillDuration",
  "expandDuration",
  "toastDismissDuration",
  "progressFillDuration",
  "progressIndeterminateDuration",
];

function isMotionDurationToken(value: string): value is MotionDurationToken {
  return (MOTION_DURATION_TOKENS as readonly string[]).includes(value);
}

/** Seconds for GSAP `delay`. `"expand"` → `expandDuration`. Invalid / non-finite → omit. */
export function resolveMotionDelay(
  delay: MotionDelay | undefined,
  cfg: Readonly<MotionConfig>,
): number | undefined {
  if (delay === undefined) return undefined;
  if (typeof delay === "number") {
    return Number.isFinite(delay) ? Math.max(0, delay) : undefined;
  }
  const key = delay === "expand" ? "expandDuration" : delay;
  if (!isMotionDurationToken(key)) return undefined;
  const ms = cfg[key];
  if (typeof ms !== "number" || !Number.isFinite(ms)) return undefined;
  return Math.max(0, ms / 1000);
}

/**
 * Timeline children must coexist on the same node (lift then scale then rest).
 * App-event `ctx.to` still uses `overwrite: true`; a timeline with that flag
 * kills earlier tweens at **add** time, so the last rest pose looks like a no-op.
 */
const TIMELINE_OVERWRITE = "auto" as const;

function pickTransform(vars: MotionTweenVars): MotionTweenVars {
  const out: MotionTweenVars = {};
  for (const key of TRANSFORM_KEYS) {
    if (vars[key] !== undefined) out[key] = vars[key];
  }
  return out;
}

function hasTransform(vars: MotionTweenVars): boolean {
  return TRANSFORM_KEYS.some((key) => vars[key] !== undefined);
}

function toGsapVars(
  vars: MotionTweenVars,
  cfg: Readonly<MotionConfig>,
  overwrite: "auto" | true,
): Record<string, unknown> {
  const props = pickTransform(vars);
  const delay = resolveMotionDelay(vars.delay, cfg);
  return {
    ...props,
    duration: vars.duration ?? cfg.interactiveDuration / 1000,
    ease: vars.ease ?? cfg.interactiveEase,
    ...(vars.yoyo !== undefined ? { yoyo: vars.yoyo } : {}),
    ...(vars.repeat !== undefined ? { repeat: vars.repeat } : {}),
    ...(delay !== undefined ? { delay } : {}),
    overwrite,
    force3D: false,
  };
}

function asAnimation(tween: object): MotionAnimation {
  return tween as unknown as MotionAnimation;
}

export function playDeclarativeMotion(
  el: HTMLElement,
  vars: MotionVars,
  options: {
    phase: MotionPhaseName | (string & {});
    reduced: boolean;
    config: Readonly<MotionConfig>;
  },
): MotionAnimation | undefined {
  const tweenVars: MotionTweenVars = {};
  for (const key of PUBLIC_TRANSFORM_KEYS) {
    if (vars[key] !== undefined) tweenVars[key] = vars[key];
  }
  if (vars.duration !== undefined) tweenVars.duration = vars.duration;
  if (vars.ease !== undefined) tweenVars.ease = vars.ease;
  if (vars.yoyo !== undefined) tweenVars.yoyo = vars.yoyo;
  if (vars.repeat !== undefined) tweenVars.repeat = vars.repeat;
  if (vars.delay !== undefined) tweenVars.delay = vars.delay;
  if (!hasTransform(tweenVars)) return undefined;

  const replay = resolveMotionReplay(options.phase, vars);
  return playTween(el, replay === "rest" ? motionRestVars(tweenVars) : undefined, tweenVars, {
    reduced: options.reduced,
    config: options.config,
    overwrite: overwriteFor(options.phase),
  });
}

function playTween(
  el: HTMLElement | null | undefined,
  from: MotionTweenVars | undefined,
  vars: MotionTweenVars,
  options: {
    reduced: boolean;
    config: Readonly<MotionConfig>;
    overwrite: "auto" | true;
  },
): MotionAnimation | undefined {
  if (!el || !hasTransform(vars)) return undefined;
  const props = pickTransform(vars);
  if (options.reduced) {
    gsap.set(el, { ...props, force3D: false });
    return undefined;
  }
  const toVars = toGsapVars(vars, options.config, options.overwrite);
  if (from) {
    return asAnimation(
      gsap.fromTo(el, pickTransform(from), { ...toVars, immediateRender: true }),
    );
  }
  return asAnimation(gsap.to(el, toVars));
}

export function createMotionTweenApi(host: MotionTweenHost): MotionTweenApi {
  const overwrite = overwriteFor(host.phase);

  const track = (animation: MotionAnimation | undefined): MotionAnimation | undefined => {
    if (!animation) return undefined;
    host.onCleanup(() => {
      animation.kill();
    });
    host.setAnimation(animation);
    return animation;
  };

  const play = (
    el: HTMLElement | null | undefined,
    from: MotionTweenVars | undefined,
    vars: MotionTweenVars,
  ): MotionAnimation | undefined =>
    track(
      playTween(el, from, vars, {
        reduced: host.reduced,
        config: host.config,
        overwrite,
      }),
    );

  const to: MotionTweenApi["to"] = (
    a: MotionTweenVars | HTMLElement | null | undefined,
    b?: MotionTweenVars,
  ) => {
    const el = b === undefined ? host.el : a;
    const vars = (b === undefined ? a : b) as MotionTweenVars;
    return play(el as HTMLElement | null | undefined, undefined, vars);
  };

  const fromRest: MotionTweenApi["fromRest"] = (
    a: MotionTweenVars | HTMLElement | null | undefined,
    b?: MotionTweenVars,
  ) => {
    const el = b === undefined ? host.el : a;
    const vars = (b === undefined ? a : b) as MotionTweenVars;
    return play(el as HTMLElement | null | undefined, motionRestVars(vars), vars);
  };

  const fromTo: MotionTweenApi["fromTo"] = (
    a: MotionTweenVars | HTMLElement | null | undefined,
    b: MotionTweenVars,
    c?: MotionTweenVars,
  ) => {
    if (c === undefined) {
      return play(host.el, a as MotionTweenVars, b);
    }
    return play(a as HTMLElement | null | undefined, b, c);
  };

  const timeline = (): MotionTimeline => {
    const tl = gsap.timeline({
      defaults: {
        overwrite: TIMELINE_OVERWRITE,
        force3D: false,
        duration: host.config.interactiveDuration / 1000,
        ease: host.config.interactiveEase,
      },
    });
    const animation = asAnimation(tl);
    track(animation);

    const self: MotionTimeline = {
      kill: () => {
        tl.kill();
      },
      eventCallback: ((type, callback) =>
        tl.eventCallback(
          type as gsap.CallbackType,
          callback as gsap.Callback,
        )) as MotionAnimation["eventCallback"],
      repeat: (value?: number) => {
        if (value === undefined) return tl.repeat();
        tl.repeat(value);
        return tl.repeat();
      },
      to: (el, vars, position) => {
        addTween(el, undefined, vars, position);
        return self;
      },
      fromTo: (el, from, vars, position) => {
        addTween(el, from, vars, position);
        return self;
      },
      fromRest: (el, vars, position) => {
        addTween(el, motionRestVars(vars), vars, position);
        return self;
      },
      add: (child, position) => {
        if (child) tl.add(child as gsap.core.Animation, position);
        return self;
      },
      wait: (delay, position) => {
        const seconds = resolveMotionDelay(delay, host.config) ?? 0;
        if (host.reduced || seconds <= 0) return self;
        tl.to({}, { duration: seconds, ease: "none" }, position);
        return self;
      },
    };

    function addTween(
      el: HTMLElement | null | undefined,
      from: MotionTweenVars | undefined,
      vars: MotionTweenVars,
      position: MotionTimelinePosition | undefined,
    ): void {
      if (!el || !hasTransform(vars)) return;
      if (host.reduced) {
        gsap.set(el, { ...pickTransform(vars), force3D: false });
        return;
      }
      const toVars = toGsapVars(vars, host.config, TIMELINE_OVERWRITE);
      if (from) tl.fromTo(el, pickTransform(from), { ...toVars, immediateRender: true }, position);
      else tl.to(el, toVars, position);
    }

    return self;
  };

  const wait = (delay: MotionDelay) => waitMotionDelay(host, delay);
  const sequence = (...steps: MotionSequenceStep[]) => runMotionSequence(host, steps);
  const parallel = (...steps: MotionSequenceStep[]) => runMotionParallel(host, steps);

  return { to, fromRest, fromTo, timeline, wait, sequence, parallel };
}

function motionAbortError(): Error {
  if (typeof DOMException === "function") {
    return new DOMException("Motion wait aborted", "AbortError");
  }
  const error = new Error("Motion wait aborted");
  error.name = "AbortError";
  return error;
}

function throwIfMotionAborted(signal: AbortSignal): void {
  if (signal.aborted) throw motionAbortError();
}

function isDelayStep(step: MotionSequenceStep): step is MotionDelay {
  return typeof step === "number" || typeof step === "string";
}

function waitForMotionAnimation(
  animation: MotionAnimation,
  signal: AbortSignal,
): Promise<void> {
  throwIfMotionAborted(signal);
  const hook = animation.eventCallback;
  if (typeof hook !== "function") return Promise.resolve();
  return new Promise((resolve, reject) => {
    let settled = false;
    const finish = (fn: () => void) => {
      if (settled) return;
      settled = true;
      signal.removeEventListener("abort", onAbort);
      fn();
    };
    const onAbort = () => finish(() => reject(motionAbortError()));
    signal.addEventListener("abort", onAbort, { once: true });
    const prev = hook.call(animation, "onComplete");
    hook.call(animation, "onComplete", function (this: unknown, ...args: unknown[]) {
      if (typeof prev === "function") {
        (prev as (this: unknown, ...a: unknown[]) => unknown).apply(this, args);
      }
      finish(resolve);
    });
  });
}

async function settleMotionStep(
  host: MotionTweenHost,
  result: void | Promise<void> | Pick<MotionAnimation, "kill"> | undefined,
): Promise<void> {
  throwIfMotionAborted(host.signal);
  if (result == null) return;
  if (typeof result === "object" && "then" in result) {
    await result;
    throwIfMotionAborted(host.signal);
    return;
  }
  if (typeof result === "object" && "kill" in result) {
    await waitForMotionAnimation(result, host.signal);
  }
}

export function waitMotionDelay(host: MotionTweenHost, delay: MotionDelay): Promise<void> {
  throwIfMotionAborted(host.signal);
  const seconds = resolveMotionDelay(delay, host.config) ?? 0;
  if (host.reduced || seconds <= 0) return Promise.resolve();
  return new Promise((resolve, reject) => {
    let settled = false;
    const finish = (fn: () => void) => {
      if (settled) return;
      settled = true;
      host.signal.removeEventListener("abort", onAbort);
      fn();
    };
    const timeoutId = globalThis.setTimeout(() => {
      finish(() => {
        if (host.signal.aborted) reject(motionAbortError());
        else resolve();
      });
    }, seconds * 1000);
    const onAbort = () => {
      globalThis.clearTimeout(timeoutId);
      finish(() => reject(motionAbortError()));
    };
    host.signal.addEventListener("abort", onAbort, { once: true });
    host.onCleanup(() => {
      globalThis.clearTimeout(timeoutId);
      host.signal.removeEventListener("abort", onAbort);
    });
  });
}

export async function runMotionSequence(
  host: MotionTweenHost,
  steps: readonly MotionSequenceStep[],
): Promise<void> {
  throwIfMotionAborted(host.signal);
  for (const step of steps) {
    throwIfMotionAborted(host.signal);
    if (isDelayStep(step)) {
      await waitMotionDelay(host, step);
      continue;
    }
    await settleMotionStep(host, step());
  }
}

export async function runMotionParallel(
  host: MotionTweenHost,
  steps: readonly MotionSequenceStep[],
): Promise<void> {
  throwIfMotionAborted(host.signal);
  await Promise.all(steps.map((step) => runMotionSequence(host, [step])));
}
