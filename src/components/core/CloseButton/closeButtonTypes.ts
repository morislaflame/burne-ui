import type { ButtonHTMLAttributes, KeyboardEvent, MutableRefObject, PointerEvent } from "react";
import type { Prettify } from "@/utils/prettify";

import type { ComponentSize } from "@/components/core/utils/sizeLayout";
import type { MotionValue } from "@/components/core/utils/slotMotion";

export type CloseButtonVariant =
  | "default"
  | "primary"
  | "outline"
  | "secondary"
  | "ghost"
  | "gloss";

export type CloseButtonSize = ComponentSize;

export type CloseButtonClassNames = {
  root?: string;
  icon?: string;
  ripple?: string;
};

export type CloseButtonPartMotion = {
  hoverIn?: MotionValue;
  hoverOut?: MotionValue;
  pressIn?: MotionValue;
  pressOut?: MotionValue;
};

export type CloseButtonMotion = {
  root?: CloseButtonPartMotion;
  icon?: CloseButtonPartMotion;
};

export type CloseButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  variant?: CloseButtonVariant;
  size?: CloseButtonSize;
  ripple?: boolean;
  classNames?: Prettify<CloseButtonClassNames>;
  motion?: Prettify<CloseButtonMotion>;
};

export type CloseButtonClassNamesProviderProps = {
  classNames?: Prettify<CloseButtonClassNames>;
  children: React.ReactNode;
};

export type UseCloseButtonRootStateProps = Omit<
  CloseButtonProps,
  | "onPointerDown"
  | "onPointerUp"
  | "onPointerEnter"
  | "onPointerLeave"
  | "onPointerOver"
  | "onPointerOut"
  | "onKeyDown"
  | "motion"
>;

export type UseCloseButtonAnimationsProps = {
  variant: CloseButtonVariant;
  disabled: boolean;
  forwardedRef: React.ForwardedRef<HTMLButtonElement>;
  motion?: CloseButtonMotion;
  hoverPointerInsideRef: MutableRefObject<boolean>;
  onPointerDown?: (e: PointerEvent<HTMLButtonElement>) => void;
  onPointerUp?: (e: PointerEvent<HTMLButtonElement>) => void;
  onPointerEnter?: (e: PointerEvent<HTMLButtonElement>) => void;
  onPointerLeave?: (e: PointerEvent<HTMLButtonElement>) => void;
  onPointerOver?: (e: PointerEvent<HTMLButtonElement>) => void;
  onPointerOut?: (e: PointerEvent<HTMLButtonElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLButtonElement>) => void;
};
