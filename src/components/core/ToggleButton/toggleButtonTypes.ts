import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  PointerEventHandler,
  ReactNode,
  RefObject,
} from "react";

import type { ButtonGroupSegment } from "@/components/composite/ButtonGroup/buttonGroupTypes";
import type { ComponentSize } from "@/components/core/utils/componentSize";
import type { IconPosition } from "@/components/core/utils/iconPosition";


export type ToggleButtonSize = ComponentSize;

export type ToggleButtonVariant = "default" | "outline" | "ghost" | "gloss";

export type ToggleButtonGroupType = "multiple" | "single";

export type ToggleButtonGroupOrientation = "horizontal" | "vertical";

export type ToggleButtonClassNames = {
  root?: string;
  fill?: string;
  content?: string;
  label?: string;
  icon?: string;
  text?: string;
};

export type ToggleButtonContextValue = {
  size: ToggleButtonSize;
  groupSegment: ButtonGroupSegment | undefined;
  contentMotionRef: RefObject<HTMLSpanElement | null>;
  bindFillRef: (node: HTMLSpanElement | null) => void;
  fillColor: string;
  pressed: boolean;
  roundingClass: string;
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
  icon?: ReactNode;
  /** @default "start" */
  iconPosition?: IconPosition;
  animated?: boolean;
  classNames?: ToggleButtonClassNames;
};

export type ToggleButtonFillProps = HTMLAttributes<HTMLSpanElement>;

export type ToggleButtonContentProps = HTMLAttributes<HTMLSpanElement>;

export type ToggleButtonLabelProps = HTMLAttributes<HTMLSpanElement>;

export type ToggleButtonIconStartProps = HTMLAttributes<HTMLSpanElement> & {
  children?: ReactNode;
};

export type ToggleButtonIconEndProps = HTMLAttributes<HTMLSpanElement> & {
  children?: ReactNode;
};

export type ToggleButtonTextProps = HTMLAttributes<HTMLSpanElement> & {
  children?: ReactNode;
};

export type ToggleButtonSimpleContentProps = {
  icon?: ReactNode;
  iconPosition?: IconPosition;
  children?: ReactNode;
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
  | "children"
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


