import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  MouseEvent,
  ReactNode,
  RefObject,
} from "react";

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

export type ButtonClassNames = {
  root?: string;
  content?: string;
  label?: string;
  icon?: string;
  text?: string;
  loader?: string;
  success?: string;
  error?: string;
};

export type ButtonContextValue = {
  size: ButtonSize;
  variant: ButtonVariant;
  status: ButtonStatus;
  asyncState: ButtonAsyncState;
  groupSegment: ButtonGroupSegment | undefined;
  loaderTextClass: string;
  bindLabelRef: (node: HTMLSpanElement | null) => void;
  bindLoaderRef: (node: HTMLSpanElement | null) => void;
  bindSuccessRef: (node: HTMLSpanElement | null) => void;
  bindErrorRef: (node: HTMLSpanElement | null) => void;
  contentMotionRef: RefObject<HTMLSpanElement | null>;
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
  classNames?: ButtonClassNames;
  /**
   * Enable converge-ripple from the press point (`<Ripple />` inside the button, tone under `variant`).
   * @default false
   */
  ripple?: boolean;
};

export type ButtonContentProps = HTMLAttributes<HTMLSpanElement>;

export type ButtonLabelProps = HTMLAttributes<HTMLSpanElement>;

export type ButtonIconProps = HTMLAttributes<HTMLSpanElement> & {
  children?: ReactNode;
};

export type ButtonTextProps = HTMLAttributes<HTMLSpanElement> & {
  children?: ReactNode;
};

export type ButtonLoaderProps = HTMLAttributes<HTMLSpanElement>;

export type ButtonSuccessProps = HTMLAttributes<HTMLSpanElement>;

export type ButtonErrorProps = HTMLAttributes<HTMLSpanElement>;

export type ButtonSimpleContentProps = {
  leftIcon?: ReactNode;
  children?: ReactNode;
};

export type ButtonExpandRippleLayerProps = {
  clipClass: string;
  expandRipples: ExpandRipple[];
  onDismiss: (id: number) => void;
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
  | "classNames"
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
  groupSegment: ButtonGroupSegment | undefined;
  forwardedRef: React.ForwardedRef<HTMLButtonElement>;
  onPointerEnter?: React.PointerEventHandler<HTMLButtonElement>;
  onPointerLeave?: React.PointerEventHandler<HTMLButtonElement>;
  onPointerDown?: React.PointerEventHandler<HTMLButtonElement>;
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

