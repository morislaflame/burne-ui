import { gsap } from "@/components/core/utils/gsapMotion";
import type { MotionConfig } from "@/components/core/utils/motionConfig";

import { isMotionPhaseName } from "./slotMotionTypes";
import type {
  MotionAnimation,
  MotionPhaseName,
  MotionReplay,
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
  return {
    ...props,
    duration: vars.duration ?? cfg.interactiveDuration / 1000,
    ease: vars.ease ?? cfg.interactiveEase,
    ...(vars.yoyo !== undefined ? { yoyo: vars.yoyo } : {}),
    ...(vars.repeat !== undefined ? { repeat: vars.repeat } : {}),
    ...(vars.delay !== undefined ? { delay: vars.delay } : {}),
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
    return asAnimation(gsap.fromTo(el, pickTransform(from), toVars));
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
        overwrite,
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
      const toVars = toGsapVars(vars, host.config, overwrite);
      if (from) tl.fromTo(el, pickTransform(from), toVars, position);
      else tl.to(el, toVars, position);
    }

    return self;
  };

  return { to, fromRest, fromTo, timeline };
}
