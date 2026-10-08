import type { ButtonHTMLAttributes, KeyboardEvent, MutableRefObject, PointerEvent } from "react";
import type { Prettify } from "@/utils/prettify";
 
import type { MotionController, MotionMapWithEvents, MotionValue, MotionStateHostProps } from "@/components/core/utils/slotMotion";
 
export type ColorSwatchSize = "small" | "base" | "mid" | "large";
export type ColorSwatchShape = "square" | "circle" | "rounded";
 
export type ColorSwatchPartMotion = {
  hoverIn?: MotionValue;
  hoverOut?: MotionValue;
  pressIn?: MotionValue;
  pressOut?: MotionValue;
};
 
export type ColorSwatchMotion = {
  root?: ColorSwatchPartMotion;
};

export type ColorSwatchClassNames = {
  /** Clip and size shell. */
  root?: string;
  /** Extra classes while `selected` is set. */
  selected?: string;
};
 
export type ColorSwatchProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color"> & {
  color?: string;
  size?: ColorSwatchSize;
  shape?: ColorSwatchShape;
  selected?: boolean;
  classNames?: Prettify<ColorSwatchClassNames>;
  /**
   * Per-slot motion (`root`). Only the interactive button (`onClick`) mounts a scope.
   * Decorative `<span>` has no Provider. `events` — namespaced app commands.
   */
  motion?: Prettify<MotionMapWithEvents<ColorSwatchMotion>>;
  /**
   * Deferred handle from `createMotionController()` / `useMotionControllerHandle()`.
   * Interactive swatch only. Not placed on the DOM.
   */
  motionController?: MotionController;
} & MotionStateHostProps;
 
export type UseColorSwatchAnimationsProps = {
  disabled: boolean;
  forwardedRef: React.ForwardedRef<HTMLButtonElement>;
  motion?: ColorSwatchMotion;
  hoverPointerInsideRef: MutableRefObject<boolean>;
  onPointerDown?: (e: PointerEvent<HTMLButtonElement>) => void;
  onPointerUp?: (e: PointerEvent<HTMLButtonElement>) => void;
  onPointerEnter?: (e: PointerEvent<HTMLButtonElement>) => void;
  onPointerLeave?: (e: PointerEvent<HTMLButtonElement>) => void;
  onPointerOver?: (e: PointerEvent<HTMLButtonElement>) => void;
  onPointerOut?: (e: PointerEvent<HTMLButtonElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLButtonElement>) => void;
};
 