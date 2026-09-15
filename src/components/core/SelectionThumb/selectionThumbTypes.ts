import type { HTMLAttributes, ReactNode, Ref, RefObject } from "react";
import type { Prettify } from "@/utils/prettify";
import type { MotionController, MotionMapWithEvents, MotionValue, MotionStateHostProps } from "@/components/core/utils/slotMotion";

import type { SelectionIndicatorSize } from "../SelectionIndicator/selectionIndicatorTokens";

export type SelectionThumbClassNames = {
  root?: string;
};

export type SelectionThumbIconClassNames = {
  root?: string;
  icon?: string;
};

export type SelectionThumbPartMotion = {
  hoverIn?: MotionValue;
  hoverOut?: MotionValue;
  pressIn?: MotionValue;
  pressOut?: MotionValue;
  enter?: MotionValue;
  leave?: MotionValue;
};

export type SelectionThumbMotion = {
  root?: SelectionThumbPartMotion;
  icon?: SelectionThumbPartMotion;
};

export type SelectionThumbProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  size?: SelectionIndicatorSize;
  shellRef?: RefObject<HTMLSpanElement | null>;
  gloss?: boolean;
  children?: ReactNode;
  classNames?: Prettify<SelectionThumbClassNames>;
  /**
   * Per-slot motion (`root`). Defaults are empty — custom factories are opt-in.
   * Switch / Slider keep their own slot motion; this map is for standalone use.
   * `events` — namespaced app commands for `MotionController.play` (not a DOM slot).
   */
  motion?: Prettify<MotionMapWithEvents<SelectionThumbMotion>>;
  /**
   * Deferred handle from `createMotionController()` / `useMotionControllerHandle()`.
   * Standalone thumb only — Switch/Slider do not forward their handle here.
   * Not placed on the DOM.
   */
  motionController?: MotionController;
} & MotionStateHostProps;

export type SelectionThumbIconProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  size?: SelectionIndicatorSize;
  gloss?: boolean;
  iconRef?: Ref<HTMLSpanElement | null>;
  children?: ReactNode;
  classNames?: Prettify<SelectionThumbIconClassNames>;
  motion?: Prettify<SelectionThumbPartMotion>;
};
