import type { HTMLAttributes } from "react";

import type { Prettify } from "@/utils/prettify";
import type {
  MotionController,
  MotionMapWithEvents,
  MotionStateHostProps,
  MotionValue,
} from "@/components/core/utils/slotMotion";
import type { LayoutAlign, LayoutJustify, LayoutSpace } from "@/components/core/utils/layoutSpace";

export type StackOrientation = "vertical" | "horizontal";

/** Domain: space scale, not `ComponentSize`. */
export type StackGap = LayoutSpace;

export type StackAlign = LayoutAlign;

export type StackJustify = LayoutJustify;

export type StackClassNames = {
  root?: string;
};

export type StackPartMotion = {
  hoverIn?: MotionValue;
  hoverOut?: MotionValue;
  pressIn?: MotionValue;
  pressOut?: MotionValue;
  enter?: MotionValue;
  leave?: MotionValue;
};

export type StackMotion = {
  root?: StackPartMotion;
};

export type StackProps = HTMLAttributes<HTMLDivElement> & {
  orientation?: StackOrientation;
  /** Domain: `--space-*`, not `ComponentSize`. */
  gap?: StackGap;
  align?: StackAlign;
  justify?: StackJustify;
  wrap?: boolean;
  classNames?: Prettify<StackClassNames>;
  /**
   * Per-slot motion (`root`). Defaults are empty — custom factories are opt-in.
   * `events` — namespaced app commands for `MotionController.play` (not a DOM slot).
   */
  motion?: Prettify<MotionMapWithEvents<StackMotion>>;
  /**
   * Deferred handle from `createMotionController()` / `useMotionControllerHandle()`.
   * Forwarded to the motion Provider (`controller`), not onto the DOM.
   */
  motionController?: MotionController;
} & MotionStateHostProps;
