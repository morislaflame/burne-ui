import type { MotionConfig } from "@/components/core/utils/motionConfig";

/** Built-in recipe names. Custom names via `registerMotionRecipe` are also valid. */
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

export type MotionPhaseName =
  | "hoverIn"
  | "hoverOut"
  | "pressIn"
  | "pressOut"
  | "enter"
  | "leave"
  | "check"
  | "uncheck";

/**
 * Transform / opacity vars for the public motion API.
 * Duration is seconds (GSAP). Do not pass layout props (`width`, `height`, `top`, `left`).
 */
export type MotionVars = {
  x?: number;
  y?: number;
  scale?: number;
  autoAlpha?: number;
  duration?: number;
  ease?: string;
};

/** Minimal GSAP animation surface (tweens / timelines). */
export type MotionAnimation = {
  kill: () => void;
  eventCallback?: (type: string, callback?: ((...args: unknown[]) => unknown) | null) => unknown;
  repeat?: (value?: number) => number;
};

export type MotionContext = {
  el: HTMLElement;
  phase: string;
  targets: Record<string, HTMLElement | null>;
  complete: () => void;
  kill: () => void;
  reduced: boolean;
  config: Readonly<MotionConfig>;
  params: Record<string, unknown>;
};

/** Return a GSAP tween/timeline (`kill`) so the kit can interrupt and wait for `leave`. */
export type MotionFactory = (
  ctx: MotionContext,
) => void | Promise<void> | { kill: () => void };

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
