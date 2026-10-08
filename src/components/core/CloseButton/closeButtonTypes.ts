import type { ButtonHTMLAttributes, KeyboardEvent, MutableRefObject, PointerEvent } from "react";
import type { Prettify } from "@/utils/prettify";
 
import type { ComponentSize } from "@/components/core/utils/sizeLayout";
import type {
  MotionController,
  MotionMapWithEvents,
  MotionValue, MotionStateHostProps, } from "@/components/core/utils/slotMotion";
 
export const KIT_CLOSE_BUTTON_VARIANTS = ["default", "primary", "outline", "secondary", "ghost"] as const;
export type KitCloseButtonVariant = (typeof KIT_CLOSE_BUTTON_VARIANTS)[number];
export type CloseButtonVariant = KitCloseButtonVariant | (string & {});
 
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
  /**
   * Per-slot motion (`root`, `icon`). Ripple is kit-internal.
   * `events` — namespaced app commands for `MotionController.play` (not a DOM slot).
   */
  motion?: Prettify<MotionMapWithEvents<CloseButtonMotion>>;
  /**
   * Deferred handle from `createMotionController()` / `useMotionControllerHandle()`.
   * Forwarded to the motion Provider (`controller`), not onto the DOM.
   */
  motionController?: MotionController;
} & MotionStateHostProps;
 
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
  | "motionController"
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
 