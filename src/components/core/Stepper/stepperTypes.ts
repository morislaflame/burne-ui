import type { ButtonHTMLAttributes, HTMLAttributes, OlHTMLAttributes, ReactNode } from "react";

import type {
  MotionController,
  MotionMapWithEvents,
  MotionStateHostProps,
  MotionValue,
} from "@/components/core/utils/slotMotion";
import type { Prettify } from "@/utils/prettify";
import type { ComponentSize } from "@/components/core/utils/sizeLayout";

/** Axis of the track. Not a `variant`: `horizontal` | `vertical` only. */
export type StepperOrientation = "horizontal" | "vertical";

export type StepperSize = ComponentSize;

/** `active` is the current step, `checked` is complete, `inactive` is ahead. */
export type StepperStepState = "active" | "checked" | "inactive";

export type StepperClassNames = {
  root?: string;
  item?: string;
  trigger?: string;
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

export type StepperTriggerProps = ButtonHTMLAttributes<HTMLButtonElement>;

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

/** Named so declaration emit keeps `rest` as `Omit`, not an inlined attribute map. */
export type UseStepperRootStateResult = {
  compound: boolean;
  steps: readonly StepperStep[] | undefined;
  children: ReactNode;
  classNames: StepperProps["classNames"];
  motion: StepperProps["motion"];
  motionController: StepperProps["motionController"];
  motionState: StepperProps["motionState"];
  motionPayload: StepperProps["motionPayload"];
  playInitialState: StepperProps["playInitialState"];
  context: StepperContextValue;
  rest: Omit<
    StepperProps,
    | "steps"
    | "children"
    | "value"
    | "defaultValue"
    | "onValueChange"
    | "orientation"
    | "linear"
    | "size"
    | "classNames"
    | "motion"
    | "motionController"
    | "motionState"
    | "motionPayload"
    | "playInitialState"
  >;
};

export type StepperItemContextValue = {
  index: number;
  value: string;
  state: StepperStepState;
  selectable: boolean;
  isLast: boolean;
};
