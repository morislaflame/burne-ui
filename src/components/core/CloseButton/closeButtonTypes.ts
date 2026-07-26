import type { ButtonHTMLAttributes, PointerEvent } from "react";

import type { ComponentSize } from "@/components/core/utils/sizeLayout";

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

export type CloseButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  variant?: CloseButtonVariant;
  size?: CloseButtonSize;
  animated?: boolean;
  ripple?: boolean;
  classNames?: CloseButtonClassNames;
};

export type CloseButtonClassNamesProviderProps = {
  classNames?: CloseButtonClassNames;
  children: React.ReactNode;
};

export type UseCloseButtonRootStateProps = Omit<
  CloseButtonProps,
  "onPointerDown" | "onPointerEnter" | "onPointerLeave"
>;

export type UseCloseButtonAnimationsProps = {
  variant: CloseButtonVariant;
  animated: boolean;
  disabled: boolean;
  forwardedRef: React.ForwardedRef<HTMLButtonElement>;
  onPointerDown?: (e: PointerEvent<HTMLButtonElement>) => void;
  onPointerEnter?: (e: PointerEvent<HTMLButtonElement>) => void;
  onPointerLeave?: (e: PointerEvent<HTMLButtonElement>) => void;
};
