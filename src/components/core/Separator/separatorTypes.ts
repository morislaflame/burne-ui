import type { HTMLAttributes } from "react";
import type { Prettify } from "@/utils/prettify";
import type { MotionValue } from "@/components/core/utils/slotMotion";

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
   */
  motion?: Prettify<SeparatorMotion>;
};
