import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
  RefObject,
} from "react";
import type { Prettify } from "@/utils/prettify";
 
import type { ComponentSize } from "@/components/core/utils/sizeLayout";
import type { IconPosition } from "@/components/core/utils/iconPosition";
import type { SemanticStatus } from "@/components/core/utils/semanticStatusIcons";
import type { MotionController, MotionMapWithEvents, MotionValue, MotionStateHostProps } from "@/components/core/utils/slotMotion";
import type { ButtonGroupSegment } from "@/components/composite/ButtonGroup";
 
export const KIT_BUTTON_VARIANTS = [
  "default",
  "primary",
  "outline",
  "secondary",
  "ghost",
] as const;
export type KitButtonVariant = (typeof KIT_BUTTON_VARIANTS)[number];
export type ButtonVariant = KitButtonVariant | (string & {});
 
export type ButtonStatus = SemanticStatus;
 
export type ButtonSize = ComponentSize;
 
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
  groupSegment: ButtonGroupSegment | undefined;
  loaderTextClass: string;
  contentMotionRef: RefObject<HTMLSpanElement | null>;
};
 
export type ButtonPartMotion = {
  hoverIn?: MotionValue;
  hoverOut?: MotionValue;
  pressIn?: MotionValue;
  pressOut?: MotionValue;
};
 
export type ButtonMotion = {
  root?: ButtonPartMotion;
  label?: ButtonPartMotion;
  icon?: ButtonPartMotion;
  text?: ButtonPartMotion;
  loader?: ButtonPartMotion;
  success?: ButtonPartMotion;
  error?: ButtonPartMotion;
};
 
export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  groupSegment?: ButtonGroupSegment;
  variant?: ButtonVariant;
  status?: ButtonStatus;
  size?: ButtonSize;
  iconOnly?: boolean;
  icon?: ReactNode;
  /** @default "start" */
  iconPosition?: IconPosition;
  classNames?: Prettify<ButtonClassNames>;
  /**
   * Per-slot motion (`root` = the button, or the inner content span in a ButtonGroup segment;
   * `label` / `icon` / `text`; overlay `loader` / `success` / `error` when the app mounts those parts).
   * Hover/press defaults: `hoverLiftFirstLevel` / `pressSqueeze`. A skin overlays its own recipes.
   * `events` — namespaced app commands for `MotionController.play` (not a DOM slot).
   * `states` — app modes for `motionState` (not a DOM slot, not a phase).
   */
  motion?: Prettify<MotionMapWithEvents<ButtonMotion>>;
  /**
   * Deferred handle from `createMotionController()` / `useMotionControllerHandle()`.
   * Forwarded to the motion Provider (`controller`), not onto the DOM.
   */
  motionController?: MotionController;
  /**
   * Enable converge-ripple from the press point (`<Ripple />` inside the button, tone under `variant`).
   * @default false
   */
  ripple?: boolean;
} & MotionStateHostProps;
 
export type ButtonContentProps = HTMLAttributes<HTMLSpanElement>;
 
export type ButtonLabelProps = HTMLAttributes<HTMLSpanElement> & {
  motion?: Prettify<ButtonPartMotion>;
};
 
export type ButtonIconProps = HTMLAttributes<HTMLSpanElement> & {
  children?: ReactNode;
  motion?: Prettify<ButtonPartMotion>;
};
 
export type ButtonTextProps = HTMLAttributes<HTMLSpanElement> & {
  children?: ReactNode;
  motion?: Prettify<ButtonPartMotion>;
};
 
export type ButtonLoaderProps = HTMLAttributes<HTMLSpanElement> & {
  motion?: Prettify<ButtonPartMotion>;
};
 
export type ButtonSuccessProps = HTMLAttributes<HTMLSpanElement> & {
  motion?: Prettify<ButtonPartMotion>;
};
 
export type ButtonErrorProps = HTMLAttributes<HTMLSpanElement> & {
  motion?: Prettify<ButtonPartMotion>;
};
 
export type ButtonSimpleContentProps = {
  icon?: ReactNode;
  iconPosition?: IconPosition;
  children?: ReactNode;
};
 
export type UseButtonRootStateProps = Pick<
  ButtonProps,
  | "variant"
  | "status"
  | "size"
  | "iconOnly"
  | "groupSegment"
  | "disabled"
  | "className"
  | "classNames"
  | "ripple"
  | "icon"
  | "iconPosition"
  | "children"
  | "onClick"
  | "type"
>;
 
export type UseButtonAnimationsProps = {
  variant: ButtonVariant;
  blocked: boolean;
  groupSegment: ButtonGroupSegment | undefined;
  motion?: ButtonMotion;
  hoverPointerInsideRef: RefObject<boolean>;
  forwardedRef: React.ForwardedRef<HTMLButtonElement>;
  onPointerEnter?: React.PointerEventHandler<HTMLButtonElement>;
  onPointerLeave?: React.PointerEventHandler<HTMLButtonElement>;
  onPointerOver?: React.PointerEventHandler<HTMLButtonElement>;
  onPointerOut?: React.PointerEventHandler<HTMLButtonElement>;
  onPointerDown?: React.PointerEventHandler<HTMLButtonElement>;
  onPointerUp?: React.PointerEventHandler<HTMLButtonElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLButtonElement>;
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
 