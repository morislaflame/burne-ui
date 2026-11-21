import type { HTMLAttributes } from "react";
import type { Prettify } from "@/utils/prettify";
import type { MotionController, MotionMapWithEvents, MotionValue, MotionStateHostProps } from "@/components/core/utils/slotMotion";
 
import type { ShadowSize } from "@/tokens/shadows";
 
export const KIT_SURFACE_VARIANTS = ["default", "secondary", "tertiary"] as const;
export type KitSurfaceVariant = (typeof KIT_SURFACE_VARIANTS)[number];
export type SurfaceVariant = KitSurfaceVariant | (string & {});
 
export type SurfaceShadow = ShadowSize;
 
export type SurfacePadding = "none" | "small" | "base" | "mid" | "large";
 
export type SurfaceRadius = "base" | "mid" | "large";
 
export type SurfaceClassNames = {
  root?: string;
};
 
export type SurfacePartMotion = {
  hoverIn?: MotionValue;
  hoverOut?: MotionValue;
  pressIn?: MotionValue;
  pressOut?: MotionValue;
  enter?: MotionValue;
  leave?: MotionValue;
};
 
export type SurfaceMotion = {
  root?: SurfacePartMotion;
};
 
export type SurfaceProps = HTMLAttributes<HTMLDivElement> & {
  variant?: SurfaceVariant;
  shadow?: SurfaceShadow;
  padding?: SurfacePadding;
  radius?: SurfaceRadius;
  classNames?: Prettify<SurfaceClassNames>;
  /**
 * Per-slot motion (`root`). `Content` is a layout wrapper, not a motion slot.
   * Defaults are empty — custom factories are opt-in.
   * `events` — namespaced app commands for `MotionController.play` (not a DOM slot).
   */
  motion?: Prettify<MotionMapWithEvents<SurfaceMotion>>;
  /**
   * Deferred handle from `createMotionController()` / `useMotionControllerHandle()`.
   * Forwarded to the motion Provider (`controller`), not onto the DOM.
   */
  motionController?: MotionController;
} & MotionStateHostProps;
 