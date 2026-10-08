import type { HTMLAttributes, OlHTMLAttributes, ReactNode } from "react";

import type {
  MotionController,
  MotionMapWithEvents,
  MotionStateHostProps,
  MotionValue,
} from "@/components/core/utils/slotMotion";
import type { Prettify } from "@/utils/prettify";

/** Axis of the track. Not a `variant`: `horizontal` | `vertical` only. */
export type StepperOrientation = "horizontal" | "vertical";

export type StepperSize = "small" | "base" | "mid" | "large";

/** `active` is the current step, `checked` is complete, `inactive` is ahead. */
export type StepperStepState = "active" | "checked" | "inactive";

export type StepperClassNames = {
  root?: string;
  item?: string;
  indicator?: string;
  title?: string;
  description?: string;
  separator?: string;
};

export type StepperPartMotion = {
  hoverIn?: MotionValue;
  hoverOut?: MotionValue;
  pressIn?: MotionValue;
  pressOut?: MotionValue;
  enter?: MotionValue;
  leave?: MotionValue;
};

export type StepperMotion = {
  root?: StepperPartMotion;
  item?: StepperPartMotion;
  indicator?: StepperPartMotion;
  title?: StepperPartMotion;
  description?: StepperPartMotion;
  separator?: StepperPartMotion;
};

export type StepperStep = {
  value: string;
  title: ReactNode;
  description?: ReactNode;
};

export type StepperProps = Omit<OlHTMLAttributes<HTMLOListElement>, "children" | "defaultValue"> & {
  /** Simple API. Ignored when `Stepper.Item` is among children. */
  steps?: readonly StepperStep[];
  children?: ReactNode;
  /** Current step id. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /**
   * Track axis. Domain name, not canon `variant`.
   * `horizontal` | `vertical`.
   */
  orientation?: StepperOrientation;
  /** When true, only the current step and earlier ones can be selected. */
  linear?: boolean;
  size?: StepperSize;
  classNames?: Prettify<StepperClassNames>;
  /**
   * Per-slot motion. `events` and `states` sit beside the slots.
   * `play()` hits `root`. Repeated steps share `item`, `indicator`, `title`, `description`, `separator`.
   */
  motion?: Prettify<MotionMapWithEvents<StepperMotion>>;
  /** One handle for this stepper scope. Not placed on the DOM. */
  motionController?: MotionController;
} & MotionStateHostProps;

export type StepperItemProps = {
  value: string;
  title?: ReactNode;
  description?: ReactNode;
  className?: string;
  children?: ReactNode;
  motion?: Prettify<StepperPartMotion>;
  /** @internal Set by the root from sibling order. */
  index?: number;
  /** @internal */
  isLast?: boolean;
};

export type StepperIndicatorProps = HTMLAttributes<HTMLSpanElement> & {
  motion?: Prettify<StepperPartMotion>;
};

export type StepperTitleProps = HTMLAttributes<HTMLSpanElement> & {
  motion?: Prettify<StepperPartMotion>;
};

export type StepperDescriptionProps = HTMLAttributes<HTMLSpanElement> & {
  motion?: Prettify<StepperPartMotion>;
};

export type StepperContextValue = {
  orientation: StepperOrientation;
  size: StepperSize;
  currentIndex: number;
  linear: boolean;
  select: (value: string) => void;
};

export type StepperItemContextValue = {
  index: number;
  value: string;
  state: StepperStepState;
  selectable: boolean;
  isLast: boolean;
};
