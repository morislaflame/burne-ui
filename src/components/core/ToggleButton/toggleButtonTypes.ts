import type {
  ButtonHTMLAttributes,
  PointerEventHandler,
  ReactNode,
} from "react";

import type { ButtonGroupSegment } from "@/components/composite/ButtonGroup/buttonGroupTypes";
import type { ComponentSize } from "@/components/core/utils/componentSize";
import type { TextVariant } from "@/components/core/Text";

export type ToggleButtonSize = ComponentSize;

export type ToggleButtonVariant = "default" | "outline" | "ghost" | "gloss";

export type ToggleButtonGroupType = "multiple" | "single";

export type ToggleButtonGroupOrientation = "horizontal" | "vertical";

export type ToggleButtonClassNames = {
  root?: string;
  fill?: string;
  content?: string;
  leftIcon?: string;
  rightIcon?: string;
  label?: string;
};

export type ToggleButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "aria-pressed" | "aria-checked" | "role" | "value"
> & {
  value?: string;
  groupSegment?: ButtonGroupSegment;
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  onFillStart?: (pressed: boolean) => void;
  variant?: ToggleButtonVariant;
  fillColor?: string;
  size?: ToggleButtonSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  animated?: boolean;
  classNames?: ToggleButtonClassNames;
};

export type ToggleButtonGroupContextValue = {
  type: ToggleButtonGroupType;
  disabled: boolean;
  size: ToggleButtonSize;
  variant: ToggleButtonVariant;
  isSelected: (value: string) => boolean;
  select: (value: string) => void;
  tabIndexFor: (value: string) => 0 | -1 | undefined;
};

export type UseToggleButtonRootStateProps = Pick<
  ToggleButtonProps,
  | "value"
  | "groupSegment"
  | "pressed"
  | "defaultPressed"
  | "onPressedChange"
  | "onFillStart"
  | "variant"
  | "fillColor"
  | "size"
  | "animated"
  | "disabled"
  | "className"
  | "classNames"
  | "onClick"
>;

export type UseToggleButtonAnimationsProps = {
  animated: boolean;
  disabled: boolean;
  variant: ToggleButtonVariant;
  groupSegment: ButtonGroupSegment | undefined;
  forwardedRef: React.ForwardedRef<HTMLButtonElement>;
  pressed: boolean;
  onFillStart?: (pressed: boolean) => void;
  onPointerEnter?: PointerEventHandler<HTMLButtonElement>;
  onPointerLeave?: PointerEventHandler<HTMLButtonElement>;
  onPointerDown?: PointerEventHandler<HTMLButtonElement>;
};

export type ToggleButtonContentProps = {
  size: ToggleButtonSize;
  groupSegment: ButtonGroupSegment | undefined;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children?: ReactNode;
  contentMotionRef: React.RefObject<HTMLSpanElement | null>;
  classNames?: ToggleButtonClassNames;
};

export const TOGGLE_BUTTON_TEXT_VARIANT: Record<ToggleButtonSize, TextVariant> = {
  small: "small",
  base: "base",
  mid: "mid",
  large: "mid",
};
