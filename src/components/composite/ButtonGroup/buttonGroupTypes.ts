import type { ComponentPropsWithoutRef, HTMLAttributes, ReactNode } from "react";
import type { Prettify } from "@/utils/prettify";
import type { MotionValue } from "@/components/core/utils/slotMotion";

import type { ButtonSize, ButtonVariant } from "@/components/core/Button";

export type ButtonGroupOrientation = "horizontal" | "vertical";

export type ButtonGroupSegmentPosition = "first" | "middle" | "last" | "only";

/** Position of the segment in the joined group (`Button`, `ButtonGroup.Text`, adjacent form elements in toolbars). */
export type ButtonGroupSegment = Readonly<{
  orientation: ButtonGroupOrientation;
  position: ButtonGroupSegmentPosition;
}>;

export type ButtonGroupClassNames = {
  /** Root `<div role="group">`. */
  root?: string;
  /** Separator between glued segments — layout only, no compound part. */
  separator?: string;
  /** `ButtonGroup.Text` span wrapper. */
  text?: string;
  /** Text label inside `ButtonGroup.Text`. */
  textLabel?: string;
};

export type ButtonGroupPartMotion = {
  hoverIn?: MotionValue;
  hoverOut?: MotionValue;
  pressIn?: MotionValue;
  pressOut?: MotionValue;
  enter?: MotionValue;
  leave?: MotionValue;
};

export type ButtonGroupMotion = {
  root?: ButtonGroupPartMotion;
  text?: ButtonGroupPartMotion;
};

export type ButtonGroupProps = Omit<HTMLAttributes<HTMLDivElement>, "role" | "children"> & {
  orientation?: ButtonGroupOrientation;
  segmented?: boolean;
  buttonSize?: ButtonSize;
  variant?: ButtonVariant;
  classNames?: Prettify<ButtonGroupClassNames>;
  children: ReactNode;
  /**
   * Per-slot motion (`root`, `text`). Items keep Button motion — group does not wrap item hosts.
   * Defaults are empty.
   */
  motion?: Prettify<ButtonGroupMotion>;
};

export type ButtonGroupTextProps = ComponentPropsWithoutRef<"span"> & {
  groupSegment?: ButtonGroupSegment;
  buttonSize?: ButtonSize;
  motion?: Prettify<ButtonGroupPartMotion>;
};

export type ButtonGroupClassNamesProviderProps = {
  classNames?: Prettify<ButtonGroupClassNames>;
  children: ReactNode;
};

export type ButtonGroupSegmentContextValue = {
  segment: ButtonGroupSegment;
  buttonSize: ButtonSize;
  variant?: ButtonVariant;
};

export type ButtonGroupLayoutContextValue = {
  segmented: boolean;
};

export type UseButtonGroupRootStateProps = Pick<
  ButtonGroupProps,
  "children" | "orientation" | "segmented" | "buttonSize" | "variant"
>;
