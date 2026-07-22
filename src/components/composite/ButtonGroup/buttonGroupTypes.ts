import type { ComponentPropsWithoutRef, HTMLAttributes, ReactNode } from "react";

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

export type ButtonGroupProps = Omit<HTMLAttributes<HTMLDivElement>, "role" | "children"> & {
  orientation?: ButtonGroupOrientation;
  segmented?: boolean;
  buttonSize?: ButtonSize;
  variant?: ButtonVariant;
  classNames?: ButtonGroupClassNames;
  children: ReactNode;
};

export type ButtonGroupTextProps = ComponentPropsWithoutRef<"span"> & {
  groupSegment?: ButtonGroupSegment;
  buttonSize?: ButtonSize;
};

export type ButtonGroupClassNamesProviderProps = {
  classNames?: ButtonGroupClassNames;
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
