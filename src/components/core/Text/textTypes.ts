import type { ElementType, HTMLAttributes } from "react";
import type { Prettify } from "@/utils/prettify";
import type { MotionValue } from "@/components/core/utils/slotMotion";

export type TextVariant =
  | "accent-header"
  | "header-1"
  | "header-2"
  | "large"
  | "mid"
  | "base"
  | "small"
  | "xsmall";

export type TextPartMotion = {
  hoverIn?: MotionValue;
  hoverOut?: MotionValue;
  pressIn?: MotionValue;
  pressOut?: MotionValue;
  enter?: MotionValue;
  leave?: MotionValue;
};

export type TextMotion = {
  root?: TextPartMotion;
};

export type TextProps = Omit<HTMLAttributes<HTMLElement>, "className"> & {
  variant: TextVariant;
  as?: ElementType;
  inheritColor?: boolean;
  className?: string;
  /**
   * Per-slot motion (`root`). Defaults are empty — custom factories are opt-in.
   * `enter` runs on mount only when set.
   */
  motion?: Prettify<TextMotion>;
};
