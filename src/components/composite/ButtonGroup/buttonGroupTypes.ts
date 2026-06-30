import type { ComponentPropsWithoutRef, HTMLAttributes, ReactNode } from "react";

import type { ButtonSize, ButtonVariant } from "@/components/core/Button";

export type ButtonGroupOrientation = "horizontal" | "vertical";

export type ButtonGroupSegmentPosition = "first" | "middle" | "last" | "only";

/** Position of the segment in the joined group (`Button`, `ButtonGroup.Text`, adjacent form elements in toolbars). */
export type ButtonGroupSegment = Readonly<{
  orientation: ButtonGroupOrientation;
  position: ButtonGroupSegmentPosition;
}>;

export type ButtonGroupProps = Omit<HTMLAttributes<HTMLDivElement>, "role" | "children"> & {
  orientation?: ButtonGroupOrientation;
  segmented?: boolean;
  buttonSize?: ButtonSize;
  variant?: ButtonVariant;
  children: ReactNode;
};

export type ButtonGroupTextProps = ComponentPropsWithoutRef<"span"> & {
  groupSegment?: ButtonGroupSegment;
  buttonSize?: ButtonSize;
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
