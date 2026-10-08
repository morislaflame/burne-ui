import type { HTMLAttributes } from "react";
import type { Prettify } from "@/utils/prettify";
import type { MotionController, MotionMapWithEvents, MotionValue, MotionStateHostProps } from "@/components/core/utils/slotMotion";
 
export type SeparatorOrientation = "horizontal" | "vertical";
 
export type SeparatorPartMotion = {
  hoverIn?: MotionValue;
  hoverOut?: MotionValue;
  pressIn?: MotionValue;
  pressOut?: MotionValue;
  enter?: MotionValue;
  leave?: MotionValue;
};
 
export type SeparatorMotion = {
  root?: SeparatorPartMotion;
};
 
export type SeparatorProps = Omit<HTMLAttributes<HTMLElement>, "role"> & {
  orientation?: SeparatorOrientation;
  /**
   * Per-slot motion (`root`). Defaults are empty — custom factories are opt-in.
   * `events` — namespaced app commands for `MotionController.play` (not a DOM slot).
   */
  motion?: Prettify<MotionMapWithEvents<SeparatorMotion>>;
  /**
   * Deferred handle from `createMotionController()` / `useMotionControllerHandle()`.
   * Forwarded to the motion Provider (`controller`), not onto the DOM.
   */
  motionController?: MotionController;
} & MotionStateHostProps;
 