import type { RefObject } from "react";

import type { MotionConfig } from "@/components/core/utils/motionConfig";
import type { ShadowSize } from "@/tokens/shadows";

/** Built-in recipe names. Custom names via `registerMotionRecipe` are also valid (kit names need `{ override: true }`). */
export const KIT_MOTION_RECIPES = [
  "hoverLiftSecondLevel",
  "hoverLiftGloss",
  "hoverLiftFirstLevel",
  "pressSqueeze",
  "pressSqueezeGloss",
  "collapsibleHeight",
  "chevronRotate",
  "portalSurfaceEnter",
  "portalSurfaceLeave",
  "selectionFill",
  "selectionMark",
  "modalOverlayEnter",
  "modalOverlayLeave",
  "modalPanelEnter",
  "modalPanelLeave",
  "drawerSlideEnter",
  "drawerSlideLeave",
  "switchThumb",
  "switchFill",
  "switchIconOn",
  "switchIconOff",
  "toastSurfaceEnter",
  "toastSurfaceLeave",
  "contentFade",
  "searchExpand",
  "searchIconShift",
  "fileRowExit",
  "progressFill",
  "progressIndeterminate",
] as const;

export type KitRecipeName = (typeof KIT_MOTION_RECIPES)[number];

/** Autocomplete kit names; custom registered strings still type-check. */
export type MotionRecipeName = KitRecipeName | (string & {});

/**
 * `MotionConfig` duration key a recipe reads by default (`ctx.config[token]`).
 * Host params (`ctx.params.duration`) may still override.
 */
export type MotionDurationToken =
  | "interactiveDuration"
  | "tooltipDuration"
  | "modalDuration"
  | "switchThumbDuration"
  | "selectionFillDuration"
  | "expandDuration"
  | "toastDismissDuration"
  | "progressFillDuration"
  | "progressIndeterminateDuration";

/**
 * Tween delay: seconds, or a `MotionConfig` duration key (milliseconds → seconds).
 * `"expand"` is `expandDuration` — start after `collapsibleHeight` on Expandable / Disclosure / Accordion.
 */
export type MotionDelay = number | MotionDurationToken | "expand";

/** Reduced-motion / `enable*` off: snap to the end state, or skip the effect. */
export type MotionReducedStrategy = "instant" | "skip";

/**
 * Passport for a named recipe. Kit recipes fill every field (`KIT_MOTION_RECIPE_META`).
 * App `registerMotionRecipe(name, fn, { hidesFirstPaint: true })` overlays these.
 */
export type MotionRecipeMetadata = {
  /** Nested enter: `gsap.set(autoAlpha: 0)` before play. Portal host recipes stay `false`. */
  hidesFirstPaint: boolean;
  /** Recipe has a reduced / flag-off branch (`ctx.reduced` or `enable*`). */
  supportsReducedMotion: boolean;
  /** How that branch behaves. Pointer recipes typically `skip`; lifecycle `instant`. */
  reducedStrategy: MotionReducedStrategy;
  /** Measures or writes layout (`height` / `width` / `left`). Not for hover. */
  usesLayout: boolean;
  /** Leave returns a tween / calls `complete` so the host can unmount after. */
  supportsLeaveCompletion: boolean;
  /** Pointer phases (hover / press), not open / close / check. */
  interactive: boolean;
  defaultDurationToken: MotionDurationToken;
};

export const MOTION_RECIPE_METADATA_DEFAULTS: MotionRecipeMetadata = {
  hidesFirstPaint: false,
  supportsReducedMotion: true,
  reducedStrategy: "instant",
  usesLayout: false,
  supportsLeaveCompletion: false,
  interactive: false,
  defaultDurationToken: "interactiveDuration",
};

/** Canonical lifecycle phases. App events are a separate W3 API — do not add them here. */
export const MOTION_PHASE_NAMES = [
  "hoverIn",
  "hoverOut",
  "pressIn",
  "pressOut",
  "enter",
  "leave",
  "check",
  "uncheck",
  "change",
] as const;

export type MotionPhaseName = (typeof MOTION_PHASE_NAMES)[number];

export function isMotionPhaseName(value: string): value is MotionPhaseName {
  return (MOTION_PHASE_NAMES as readonly string[]).includes(value);
}

/**
 * Compositor vars for `MotionController.set` and kit recipes.
 * Layout (`width` / `height` / `top` / `left` / `margin`) is forbidden — no index signature.
 * Declarative `motion` maps stay on `MotionVars`; `rotation` / `scaleX` / `opacity` in a
 * factory belong in `ctx.fromRest` / `ctx.to` or `gsap.to`, not in `MotionVars`.
 */
export type MotionTransformVars = {
  x?: number;
  y?: number;
  scale?: number;
  scaleX?: number;
  scaleY?: number;
  rotation?: number;
  rotate?: number;
  autoAlpha?: number;
  opacity?: number;
  duration?: number;
  ease?: string;
};

/**
 * Where a declarative tween starts. `"current"` continues from the live pose
 * (hover / press). `"rest"` restarts from identity (`x`/`y` `0`, `scale` `1`, …)
 * so a retriggered ping does not freeze at the peak.
 */
export type MotionReplay = "rest" | "current";

/**
 * Transform / opacity vars for the public motion API (safe subset of compositor props).
 * Duration is seconds (GSAP). Do not pass layout props (`width`, `height`, `top`, `left`).
 * `rotation` / `scaleX` / `scaleY` / `opacity` are not in `MotionVars` — use a factory
 * (`ctx.fromRest` / `ctx.to`) or `MotionController.set` with `MotionTransformVars`.
 */
export type MotionVars = {
  x?: number;
  y?: number;
  scale?: number;
  autoAlpha?: number;
  duration?: number;
  ease?: string;
  yoyo?: boolean;
  repeat?: number;
  /**
   * Seconds, a `MotionDurationToken` (`"expandDuration"`), or `"expand"`
   * (`expandDuration`). Use `"expand"` so Expandable / Disclosure / Accordion
   * body enter starts after `collapsibleHeight`.
   */
  delay?: MotionDelay;
  /**
   * Start pose. Default: `"current"` for lifecycle phases; app events with
   * `yoyo: true` replay from `"rest"`. Set explicitly to override.
   */
  replay?: MotionReplay;
  /**
   * Nested enter first-paint: `"hidden"` → `gsap.set(autoAlpha: 0)` before play
   * (`hideNestedEnterSlots`). `"visible"` skips even if `autoAlpha` is set.
   * Named recipes also hide when `getMotionRecipeMetadata(name).hidesFirstPaint`.
   * Raw factories cannot be inspected — wrap as `{ recipe: "name", firstPaint: "hidden" }`
   * or pass `{ hidesFirstPaint: true }` to `registerMotionRecipe`.
   */
  firstPaint?: "hidden" | "visible";
};

/** Compositor tween vars for `ctx.to` / `ctx.fromRest` (includes `rotation` / `scaleX`). */
export type MotionTweenVars = MotionTransformVars & {
  yoyo?: boolean;
  repeat?: number;
  delay?: MotionDelay;
};

/** GSAP timeline position (`0`, `"+=0.05"`, `"<"`). */
export type MotionTimelinePosition = number | string;

/**
 * Kit timeline: `overwrite` / `force3D` are already in defaults.
 * `fromRest` restarts listed transform keys from identity.
 */
export type MotionTimeline = MotionAnimation & {
  to: (
    el: HTMLElement | null | undefined,
    vars: MotionTweenVars,
    position?: MotionTimelinePosition,
  ) => MotionTimeline;
  fromTo: (
    el: HTMLElement | null | undefined,
    from: MotionTweenVars,
    vars: MotionTweenVars,
    position?: MotionTimelinePosition,
  ) => MotionTimeline;
  fromRest: (
    el: HTMLElement | null | undefined,
    vars: MotionTweenVars,
    position?: MotionTimelinePosition,
  ) => MotionTimeline;
  add: (
    child: Pick<MotionAnimation, "kill"> | undefined,
    position?: MotionTimelinePosition,
  ) => MotionTimeline;
  /** Gap on the timeline (seconds / duration token). Prefer this over an empty tween. */
  wait: (delay: MotionDelay, position?: MotionTimelinePosition) => MotionTimeline;
};

/**
 * One step of `ctx.sequence` / `ctx.parallel`. A number or duration token is
 * `ctx.wait`. A function may return a tween (wait for complete), a Promise, or void.
 */
export type MotionSequenceStep =
  | MotionDelay
  | (() => void | Promise<void> | Pick<MotionAnimation, "kill"> | undefined);

/**
 * Closed kit host params (`MotionContext.params`). App data belongs on
 * `motionPayload` / `ctx.payload` (`MotionPayload`, `createMotionFactory`) — not
 * here, not in `configureMotion`, and not in the recipe registry.
 */
export type MotionRecipeParams = {
  pointerInside?: boolean | RefObject<boolean | null> | (() => boolean);
  hasHoverShadow?: boolean;
  shadow?: {
    idle?: string;
    hover: string;
    press?: string;
  };
  liftScale?: number;
  onReleaseStart?: () => void;
  shadowSize?: ShadowSize;
  isGloss?: boolean;
  variant?: string;
  duration?: number;
  ease?: string;
  slideDir?: number;
  isTop?: boolean;
  getTravelPx?: () => number;
  travelPx?: number;
  /** Live 0…1 fill amount for Meter / ProgressBar (`progressFill`). */
  getProgressScale?: () => number;
  /** Meter / ProgressBar orientation. `false` → vertical (origin bottom). */
  isHorizontal?: boolean;
  /** ProgressBar indeterminate translate loop (`progressIndeterminate`). */
  indeterminate?: boolean;
  placement?: "left" | "right" | "top" | "bottom";
  targetW?: number;
  collapsedDim?: number;
  expandedRadius?: number;
  padX?: number;
  iconBox?: number;
  iconLeftCollapsedCss?: string;
};

/**
 * Suggested snapshot for `motionPayload` / `ctx.payload`. All fields optional —
 * extend with app keys (`MotionPayload & { cartId: string }`).
 * Mode name is `motionState` / `ctx.toState`; progress is not a mode name.
 */
export type MotionPayload = {
  status?: string;
  /** 0…1 (or any number). Updating this alone does not replay the mode. */
  progress?: number;
  itemId?: string;
  direction?: number | string;
  from?: unknown;
  to?: unknown;
  previous?: unknown;
  next?: unknown;
  /** Server / action result for success poses. */
  result?: unknown;
  /** Server / action error for failure poses. */
  error?: unknown;
  attempt?: number;
};

/** `Readonly` on objects/arrays; primitives and `unknown` stay as-is. */
type MotionPayloadSnapshot<T> = T extends object ? Readonly<T> : T;

/** Handle stored on `MotionRun`. GSAP tweens/timelines satisfy this via `kill`. */
export type MotionAnimation = {
  kill: () => void;
  eventCallback?: (type: string, callback?: ((...args: unknown[]) => unknown) | null) => unknown;
  repeat?: (value?: number) => number;
};

export type MotionRunStatus = "running" | "finished" | "cancelled" | "failed";

export type MotionCancelReason = "superseded" | "killed" | "host" | "unmount";

/**
 * One play on one target. `finished` always settles (success, cancel, or fail)
 * so portal hosts never hang on a killed tween.
 */
export type MotionRun = {
  readonly id: number;
  readonly status: MotionRunStatus;
  readonly finished: Promise<void>;
  readonly animation: MotionAnimation | undefined;
  readonly cancelReason?: MotionCancelReason;
  cancel: (reason?: MotionCancelReason) => void;
  cleanup: () => void;
  isCurrent: () => boolean;
};

export type MotionContext<TPayload = unknown> = {
  el: HTMLElement;
  phase: MotionPhaseName | (string & {});
  /** Previous `motionState` for a state transition. Undefined for phases / events. */
  fromState?: string;
  /** Next `motionState` for a state transition (`ctx.phase` is the same name). */
  toState?: string;
  /**
   * Frozen snapshot from `motionPayload` at the start of this transition (plain
   * objects / arrays are copied). Undefined for phases / events. Type it with
   * `createMotionFactory<TPayload>` — do not close over React state.
   */
  payload?: MotionPayloadSnapshot<TPayload>;
  /**
   * Unique / first live node per slot at play time.
   * Repeated slots: use `ctx.el` (this instance) or `getTargets(slot)`.
   */
  targets: Record<string, HTMLElement | null>;
  /** Unique / first live instance. */
  getTarget: (slot: string) => HTMLElement | null;
  /** All live instances of a slot (deduped by node). */
  getTargets: (slot: string) => readonly HTMLElement[];
  /** Successful finish of **this** run. No-op after cancel / a later settle. */
  complete: () => void;
  /** Cancel this run: kill the tween, settle `finished`, do not call `complete`. */
  kill: () => void;
  reduced: boolean;
  config: Readonly<MotionConfig>;
  params: MotionRecipeParams;
  runId: number;
  isCurrent: () => boolean;
  /** Aborted when this run is cancelled (new play, `kill`, host unmount). */
  signal: AbortSignal;
  /** Register timer/RAF teardown; runs on cancel and when the run settles. */
  onCleanup: (fn: () => void) => void;
  /**
   * Fires once when this run is cancelled (new play, `kill`, unmount) — not on
   * success or `failed`. Restore pose here; do not start a new play on `ctx`.
   */
  onInterrupt: (fn: (reason?: MotionCancelReason) => void) => void;
  /**
   * Fires when the factory/recipe throws or its Promise rejects (not on AbortError
   * from `wait` / `sequence` after cancel).
   */
  onError: (fn: (error: unknown) => void) => void;
  /**
   * Cancellable delay. Seconds, a `MotionDurationToken`, or `"expand"`.
   * Reduced motion skips the timer. Cancel rejects with `AbortError`
   * (`isMotionAbortError`) — do not treat that as `failed`.
   */
  wait: (delay: MotionDelay) => Promise<void>;
  /** Run steps one after another. Delay literals call `wait`. */
  sequence: (...steps: MotionSequenceStep[]) => Promise<void>;
  /** Run steps together; settles when every step has finished. */
  parallel: (...steps: MotionSequenceStep[]) => Promise<void>;
  /**
   * Tween from the current pose. Kit sets `overwrite` (`"auto"` on phases, `true`
   * on app events) and `force3D: false` — do not copy those flags in app code.
   */
  to: {
    (vars: MotionTweenVars): MotionAnimation | undefined;
    (el: HTMLElement | null | undefined, vars: MotionTweenVars): MotionAnimation | undefined;
  };
  /**
   * Retriggerable one-shot from rest. Prefer this (or a declarative map with
   * `yoyo` / `replay: "rest"`) over raw `gsap.fromTo` + `overwrite`.
   */
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
  /** Multi-slot sequence; children inherit kit tween defaults. */
  timeline: () => MotionTimeline;
};

/**
 * Prefer returning a GSAP tween/timeline (`kill`) so the kit can interrupt and wait for `leave`.
 * A `Promise` is not cancellable — check `ctx.signal` / `isMotionRunActive(ctx)` before delayed DOM writes.
 * Package return type is `Pick<MotionAnimation, "kill">`, not `gsap.core.Animation` (peer).
 */
export type MotionFactory<TPayload = unknown> = (
  ctx: MotionContext<TPayload>,
) => void | Promise<void> | Pick<MotionAnimation, "kill">;

/** This run still owns the target and has not been cancelled. */
export function isMotionRunActive(ctx: MotionContext): boolean {
  return !ctx.signal.aborted && ctx.isCurrent();
}

/** `ctx.wait` / `sequence` / `parallel` reject this when the run is cancelled. */
export function isMotionAbortError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    (error as { name: unknown }).name === "AbortError"
  );
}

export type MotionRecipe = MotionFactory;

export type MotionValue =
  | false
  | MotionRecipeName
  | (MotionVars & { recipe?: MotionRecipeName | false })
  | MotionFactory;

export type MotionPartPhases = {
  hoverIn?: MotionValue;
  hoverOut?: MotionValue;
  pressIn?: MotionValue;
  pressOut?: MotionValue;
  enter?: MotionValue;
  leave?: MotionValue;
  check?: MotionValue;
  uncheck?: MotionValue;
  /**
   * Value / selection identity moved (not mount, not check/uncheck).
   * Hosts play via `useSlotPhaseOnChange` (first commit skipped). No kit default.
   * Not a 60fps follow — each tick cancels the previous play.
   */
  change?: MotionValue;
};

export type MotionSlotMap = {
  [slot: string]: MotionPartPhases | undefined;
};

export const LEAVE_COMPLETE_FALLBACK_MS = 500;

export function isMotionFactory(value: MotionValue): value is MotionFactory {
  return typeof value === "function";
}

export function isMotionVarsObject(
  value: MotionValue,
): value is MotionVars & { recipe?: MotionRecipeName | false } {
  return typeof value === "object" && value !== null;
}
