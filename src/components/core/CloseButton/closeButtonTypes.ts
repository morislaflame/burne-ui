import type { ButtonHTMLAttributes, PointerEvent } from "react";
import type { Prettify } from "@/utils/prettify";

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
  ripple?: boolean;
  classNames?: Prettify<CloseButtonClassNames>;
};

export type CloseButtonClassNamesProviderProps = {
  classNames?: Prettify<CloseButtonClassNames>;
  children: React.ReactNode;
};

export type UseCloseButtonRootStateProps = Omit<
  CloseButtonProps,
  "onPointerDown" | "onPointerEnter" | "onPointerLeave"
>;

export type UseCloseButtonAnimationsProps = {
  variant: CloseButtonVariant;
  disabled: boolean;
  forwardedRef: React.ForwardedRef<HTMLButtonElement>;
  onPointerDown?: (e: PointerEvent<HTMLButtonElement>) => void;
  onPointerEnter?: (e: PointerEvent<HTMLButtonElement>) => void;
  onPointerLeave?: (e: PointerEvent<HTMLButtonElement>) => void;
};
