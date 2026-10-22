import type { HTMLAttributes, ReactNode, RefObject } from "react";
import type { Prettify } from "@/utils/prettify";
 
import type { MotionController, MotionMapWithEvents, MotionValue, MotionStateHostProps } from "@/components/core/utils/slotMotion";
 
export type SelectionIndicatorSize = "xsmall" | "small" | "base" | "mid" | "large";
 
export const KIT_SELECTION_INDICATOR_VARIANTS = ["default", "secondary", "outline"] as const;
export type KitSelectionIndicatorVariant = (typeof KIT_SELECTION_INDICATOR_VARIANTS)[number];
export type SelectionIndicatorVariant = KitSelectionIndicatorVariant | (string & {});
 
export type SelectionIndicatorClassNames = {
  root?: string;
  fill?: string;
  mark?: string;
};
 
export type SelectionIndicatorPartMotion = {
  check?: MotionValue;
  uncheck?: MotionValue;
};
 
export type SelectionIndicatorMotion = {
  root?: SelectionIndicatorPartMotion;
  fill?: SelectionIndicatorPartMotion;
  mark?: SelectionIndicatorPartMotion;
};
 
export type SelectionIndicatorProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  size?: SelectionIndicatorSize;
  variant?: SelectionIndicatorVariant;
  selected: boolean;
  /** Mixed mark (dash) instead of the check. The shell still looks selected. */
  indeterminate?: boolean;
  check?: boolean;
  dot?: boolean;
  icon?: ReactNode;
  children?: ReactNode;
  classNames?: Prettify<SelectionIndicatorClassNames>;
  /**
   * Per-slot motion (`root`, `fill`, `mark`). Checkbox / Radio embed this scope — do not
   * put `motionController` on the embedder.
   * `events` — namespaced app commands for `MotionController.play` (not a DOM slot).
   */
  motion?: Prettify<MotionMapWithEvents<SelectionIndicatorMotion>>;
  /**
   * Deferred handle from `createMotionController()` / `useMotionControllerHandle()`.
   * One handle → this indicator scope (`root` / `fill` / `mark`). Not placed on the DOM.
   */
  motionController?: MotionController;
} & MotionStateHostProps;
 
export type SelectionIndicatorFillProps = HTMLAttributes<HTMLSpanElement> & {
  motion?: Prettify<SelectionIndicatorPartMotion>;
};
 
export type SelectionIndicatorMarkProps = HTMLAttributes<HTMLSpanElement> & {
  children?: ReactNode;
  motion?: Prettify<SelectionIndicatorPartMotion>;
};
 
export type ResolvedSelectionIndicatorClassNames = {
  root: string;
  fill: string;
  mark: string;
};
 
export type SelectionIndicatorContextValue = {
  fillRef: RefObject<HTMLSpanElement | null>;
  markRef: RefObject<HTMLSpanElement | null>;
  fillClassName: string;
  markClassName: string;
  markContent?: ReactNode;
  selected: boolean;
};
 