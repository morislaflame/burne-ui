import type { ButtonHTMLAttributes, MouseEvent, ReactNode } from "react";

import type { ComponentSize } from "@/components/core/utils/componentSize";
import type { ButtonGroupSegment } from "@/components/composite/ButtonGroup";

export type ButtonVariant =
  | "default"
  | "primary"
  | "outline"
  | "secondary"
  | "ghost"
  | "gloss";

export type ButtonStatus = "default" | "danger" | "success" | "info" | "warning";

export type ButtonSize = ComponentSize;

export type ButtonAsyncState = "idle" | "loading" | "success" | "error";

export type ButtonAsyncLayerKind = "label" | "loader" | "success" | "error";

export type ExpandRipple = {
  id: number;
  size: number;
  tone: "success" | "error";
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  groupSegment?: ButtonGroupSegment;
  variant?: ButtonVariant;
  status?: ButtonStatus;
  size?: ButtonSize;
  iconOnly?: boolean;
  animated?: boolean;
  asyncState?: ButtonAsyncState;
  onAsyncStateChange?: (state: ButtonAsyncState) => void;
  onAsyncClick?: (event: MouseEvent<HTMLButtonElement>) => Promise<boolean>;
  asyncFeedbackMs?: number;
  leftIcon?: ReactNode;
  /**
   * Enable converge-ripple from the press point (`<Ripple />` inside the button, tone under `variant`).
   * @default false
   */
  ripple?: boolean;
};

export type UseButtonRootStateProps = Pick<
  ButtonProps,
  | "variant"
  | "status"
  | "size"
  | "iconOnly"
  | "groupSegment"
  | "asyncState"
  | "onAsyncStateChange"
  | "onAsyncClick"
  | "asyncFeedbackMs"
  | "disabled"
  | "className"
  | "animated"
  | "ripple"
  | "leftIcon"
  | "children"
  | "onClick"
  | "type"
>;

export type UseButtonAnimationsProps = {
  variant: ButtonVariant;
  status: ButtonStatus;
  size: ButtonSize;
  animated: boolean;
  asyncState: ButtonAsyncState;
  isControlled: boolean;
  blocked: boolean;
  userDisabled: boolean;
  groupSegment: ButtonGroupSegment | undefined;
  forwardedRef: React.ForwardedRef<HTMLButtonElement>;
  onPointerEnter?: React.PointerEventHandler<HTMLButtonElement>;
  onPointerLeave?: React.PointerEventHandler<HTMLButtonElement>;
};

export type ButtonFeedbackExpandRippleProps = {
  size: number;
  tone: "success" | "error";
  onDone: () => void;
};

export type ButtonSpinnerProps = {
  className?: string;
};

export type ButtonIconCheckProps = {
  className?: string;
};

export type ButtonIconCrossProps = {
  className?: string;
};

export type ButtonContentProps = {
  size: ButtonSize;
  variant: ButtonVariant;
  status: ButtonStatus;
  asyncState: ButtonAsyncState;
  groupSegment: ButtonGroupSegment | undefined;
  leftIcon?: ReactNode;
  children?: ReactNode;
  bindLabelRef: (node: HTMLSpanElement | null) => void;
  bindLoaderRef: (node: HTMLSpanElement | null) => void;
  bindSuccessRef: (node: HTMLSpanElement | null) => void;
  bindErrorRef: (node: HTMLSpanElement | null) => void;
  contentMotionRef: React.RefObject<HTMLSpanElement | null>;
};
