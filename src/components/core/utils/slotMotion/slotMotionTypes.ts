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
] as const;

export type KitRecipeName = (typeof KIT_MOTION_RECIPES)[number];

/** Autocomplete kit names; custom registered strings still type-check. */
export type MotionRecipeName = KitRecipeName | (string & {});

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

/**
 * Kit-author compositor vars. Layout (`width` / `height` / `top` / `left` / `margin`)
 * is forbidden — no index signature. App `motion` maps stay on `MotionVars`;
 * `rotation` / `scaleX` / `opacity` in app code belong in a factory.
 * Re-exported from `burne-ui/internal`, not the public `burne-ui` entry.
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
 * Transform / opacity vars for the public motion API (safe subset of compositor props).
 * Duration is seconds (GSAP). Do not pass layout props (`width`, `height`, `top`, `left`).
 * `rotation` / `scaleX` / `scaleY` / `opacity` are not public — use a factory, or
 * `MotionTransformVars` from `burne-ui/internal` in kit recipes.
 */
export type MotionVars = {
  x?: number;
  y?: number;
  scale?: number;
  autoAlpha?: number;
  duration?: number;
  ease?: string;
  /**
   * Nested enter first-paint: `"hidden"` → `gsap.set(autoAlpha: 0)` before play
   * (`hideNestedEnterSlots`). `"visible"` skips even if `autoAlpha` is set.
   * Raw factories cannot be inspected — wrap as `{ recipe: "name", firstPaint: "hidden" }`.
   */
  firstPaint?: "hidden" | "visible";
};

/**
 * Closed kit host params (`MotionContext.params`). Custom app data stays in a
 * factory closure — do not add an index signature.
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
  placement?: "left" | "right" | "top" | "bottom";
  targetW?: number;
  collapsedDim?: number;
  expandedRadius?: number;
  padX?: number;
  iconBox?: number;
  iconLeftCollapsedCss?: string;
};

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

export type MotionContext = {
  el: HTMLElement;
  phase: MotionPhaseName;
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
};

/**
 * Prefer returning a GSAP tween/timeline (`kill`) so the kit can interrupt and wait for `leave`.
 * A `Promise` is not cancellable — check `ctx.signal` / `isMotionRunActive(ctx)` before delayed DOM writes.
 * Package return type is `Pick<MotionAnimation, "kill">`, not `gsap.core.Animation` (peer).
 */
export type MotionFactory = (
  ctx: MotionContext,
) => void | Promise<void> | Pick<MotionAnimation, "kill">;

/** This run still owns the target and has not been cancelled. */
export function isMotionRunActive(ctx: MotionContext): boolean {
  return !ctx.signal.aborted && ctx.isCurrent();
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
