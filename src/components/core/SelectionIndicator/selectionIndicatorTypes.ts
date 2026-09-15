import type { HTMLAttributes, ReactNode, RefObject } from "react";
import type { Prettify } from "@/utils/prettify";

import type { MotionController, MotionMapWithEvents, MotionValue, MotionStateHostProps } from "@/components/core/utils/slotMotion";
import type { SelectionIndicatorSize, SelectionIndicatorVariant } from "./selectionIndicatorTokens";

export type SelectionIndicatorClassNames = {
  root?: string;
  fill?: string;
  mark?: string;
};

export type SelectionIndicatorCheckMotion = {
  check?: MotionValue;
  uncheck?: MotionValue;
};

export type SelectionIndicatorMotion = {
  root?: SelectionIndicatorCheckMotion;
  fill?: SelectionIndicatorCheckMotion;
  mark?: SelectionIndicatorCheckMotion;
};

export type SelectionIndicatorProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  size?: SelectionIndicatorSize;
  variant?: SelectionIndicatorVariant;
  selected: boolean;
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
  motion?: Prettify<SelectionIndicatorCheckMotion>;
};

export type SelectionIndicatorMarkProps = HTMLAttributes<HTMLSpanElement> & {
  children?: ReactNode;
  motion?: Prettify<SelectionIndicatorCheckMotion>;
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
};
