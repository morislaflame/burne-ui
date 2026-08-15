import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  KeyboardEventHandler,
  PointerEventHandler,
  ReactNode,
  RefObject,
} from "react";
import type { Prettify } from "@/utils/prettify";

import type { ButtonGroupSegment } from "@/components/composite/ButtonGroup/buttonGroupTypes";
import type { ComponentSize } from "@/components/core/utils/sizeLayout";
import type { IconPosition } from "@/components/core/utils/iconPosition";
import type { MotionValue } from "@/components/core/utils/slotMotion";


export type ToggleButtonSize = ComponentSize;

export type ToggleButtonVariant = "default" | "outline" | "ghost" | "gloss";

export type ToggleButtonGroupType = "multiple" | "single";

export type ToggleButtonGroupOrientation = "horizontal" | "vertical";

export type ToggleButtonClassNames = {
  root?: string;
  fill?: string;
  content?: string;
  label?: string;
  iconStart?: string;
  iconEnd?: string;
  text?: string;
};

export type ToggleButtonPointerMotion = {
  hoverIn?: MotionValue;
  hoverOut?: MotionValue;
  pressIn?: MotionValue;
  pressOut?: MotionValue;
};

export type ToggleButtonCheckMotion = {
  check?: MotionValue;
  uncheck?: MotionValue;
};

export type ToggleButtonPartMotion = ToggleButtonPointerMotion & ToggleButtonCheckMotion;

export type ToggleButtonMotion = {
  root?: ToggleButtonPointerMotion;
  fill?: ToggleButtonCheckMotion;
  content?: ToggleButtonPartMotion;
  label?: ToggleButtonPartMotion;
  iconStart?: ToggleButtonPartMotion;
  iconEnd?: ToggleButtonPartMotion;
  text?: ToggleButtonPartMotion;
};

export type ToggleButtonContextValue = {
  size: ToggleButtonSize;
  variant: ToggleButtonVariant;
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
  classNames?: Prettify<ToggleButtonClassNames>;
  /**
   * Per-slot motion (`root`, `fill`, `content`, `label`, `iconStart`, `iconEnd`, `text`).
   * Root defaults: first-level lift + squeeze (gloss recipes when gloss).
   * Fill defaults: `selectionFill` on `check` / `uncheck`.
   */
  motion?: Prettify<ToggleButtonMotion>;
};

export type ToggleButtonFillProps = HTMLAttributes<HTMLSpanElement> & {
  motion?: Prettify<ToggleButtonCheckMotion>;
};

export type ToggleButtonContentProps = HTMLAttributes<HTMLSpanElement> & {
  motion?: Prettify<ToggleButtonPartMotion>;
};

export type ToggleButtonLabelProps = HTMLAttributes<HTMLSpanElement> & {
  motion?: Prettify<ToggleButtonPartMotion>;
};

export type ToggleButtonIconStartProps = HTMLAttributes<HTMLSpanElement> & {
  children?: ReactNode;
  motion?: Prettify<ToggleButtonPartMotion>;
};

export type ToggleButtonIconEndProps = HTMLAttributes<HTMLSpanElement> & {
  children?: ReactNode;
  motion?: Prettify<ToggleButtonPartMotion>;
};

export type ToggleButtonTextProps = HTMLAttributes<HTMLSpanElement> & {
  children?: ReactNode;
  motion?: Prettify<ToggleButtonPartMotion>;
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
  tabIndexFor: (value: string) => 0 | -1;
  /** Updates the roving tab stop (arrow keys / focus). Does not change selection. */
  setRovingValue: (value: string) => void;
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
  | "disabled"
  | "className"
  | "classNames"
  | "children"
  | "onClick"
  | "onFocus"
>;

export type UseToggleButtonAnimationsProps = {
  disabled: boolean;
  variant: ToggleButtonVariant;
  groupSegment: ButtonGroupSegment | undefined;
  forwardedRef: React.ForwardedRef<HTMLButtonElement>;
  pressed: boolean;
  motion?: ToggleButtonMotion;
  hoverPointerInsideRef: RefObject<boolean>;
  onReleaseStartRef: RefObject<(() => void) | undefined>;
  onFillStart?: (pressed: boolean) => void;
  onPointerEnter?: PointerEventHandler<HTMLButtonElement>;
  onPointerLeave?: PointerEventHandler<HTMLButtonElement>;
  onPointerOver?: PointerEventHandler<HTMLButtonElement>;
  onPointerOut?: PointerEventHandler<HTMLButtonElement>;
  onPointerDown?: PointerEventHandler<HTMLButtonElement>;
  onPointerUp?: PointerEventHandler<HTMLButtonElement>;
  onKeyDown?: KeyboardEventHandler<HTMLButtonElement>;
};


