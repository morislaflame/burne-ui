import type {
  HTMLAttributes,
  ReactNode,
} from "react";
import type { Prettify } from "@/utils/prettify";
import type { LabelProps } from "@/components/core/Label";
import type { MotionValue } from "@/components/core/utils/slotMotion";

export type ProgressBarSize = "small" | "base" | "mid" | "large";

export type ProgressBarOrientation = "horizontal" | "vertical";

export type ProgressBarClassNames = {
  root?: string;
  label?: string;
  header?: string;
  value?: string;
  track?: string;
  fill?: string;
  indeterminateFill?: string;
  hint?: string;
  error?: string;
};

export type ProgressBarPartMotion = {
  hoverIn?: MotionValue;
  hoverOut?: MotionValue;
  pressIn?: MotionValue;
  pressOut?: MotionValue;
  enter?: MotionValue;
  leave?: MotionValue;
  /**
   * `track`: value / indeterminate identity.
   * `fill`: determinate `progressFill` (scale) or `progressIndeterminate`.
   * Opt-in `fill.enter` — first paint at 0, then fill to `getProgressScale()`.
   */
  change?: MotionValue;
};

export type ProgressBarMotion = {
  track?: ProgressBarPartMotion;
  fill?: ProgressBarPartMotion;
  header?: ProgressBarPartMotion;
  value?: ProgressBarPartMotion;
  label?: ProgressBarPartMotion;
  hint?: ProgressBarPartMotion;
  error?: ProgressBarPartMotion;
};

export type ProgressBarDisplayState = {
  clampedValue: number;
  statusText: string;
  min: number;
  max: number;
  indeterminate: boolean;
};

export type ProgressBarFieldContextValue = {
  progressId: string;
  hintId: string;
  errorId: string;
  hintConnected: boolean;
  errorConnected: boolean;
  orientation: ProgressBarOrientation;
  display: ProgressBarDisplayState | null;
  setDisplay: (next: ProgressBarDisplayState | null) => void;
};

export type ProgressBarTrackProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  value?: number;
  indeterminate?: boolean;
  min?: number;
  max?: number;
  size?: ProgressBarSize;
  thickness?: number | string;
  color?: string;
  formatValue?: (value: number) => string;
  orientation?: ProgressBarOrientation;
  className?: string;
  motion?: Prettify<ProgressBarPartMotion>;
};

export type ProgressBarProps = HTMLAttributes<HTMLDivElement> &
  Partial<Omit<ProgressBarTrackProps, "motion">> & {
    children?: ReactNode;
    id?: string;
    orientation?: ProgressBarOrientation;
    label?: ReactNode;
    showValue?: boolean;
    valueText?: ReactNode;
    hint?: ReactNode;
    error?: ReactNode;
    classNames?: Prettify<ProgressBarClassNames>;
    /**
     * Per-slot motion (`track`, `fill`, `header`, `value`, `label`, `hint`, `error`).
     * Fill `change` defaults to `progressFill` / `progressIndeterminate`.
     * `fill.enter` is opt-in (`"progressFill"` or a factory with `ctx.params.getProgressScale`).
     * Chrome registers on the Root scope (siblings of Track). Track is the nested fill host.
     */
    motion?: Prettify<ProgressBarMotion>;
  };

export type ProgressBarClassNamesProviderProps = {
  classNames?: Prettify<ProgressBarClassNames>;
  children: ReactNode;
};

export type ProgressBarHeaderProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  motion?: Prettify<ProgressBarPartMotion>;
};

export type ProgressBarValueProps = HTMLAttributes<HTMLSpanElement> & {
  children?: ReactNode;
  motion?: Prettify<ProgressBarPartMotion>;
};

export type ProgressBarLabelProps = Omit<LabelProps, "motion"> & {
  motion?: Prettify<ProgressBarPartMotion>;
};

export type ProgressBarHintProps = HTMLAttributes<HTMLParagraphElement> & {
  children?: ReactNode;
  motion?: Prettify<ProgressBarPartMotion>;
};

export type ProgressBarErrorProps = HTMLAttributes<HTMLParagraphElement> & {
  children?: ReactNode;
  motion?: Prettify<ProgressBarPartMotion>;
};

export type UseProgressBarRootStateProps = Omit<
  ProgressBarProps,
  "className" | "classNames" | "motion"
>;

export type UseProgressBarTrackStateProps = Pick<
  ProgressBarTrackProps,
  | "value"
  | "indeterminate"
  | "min"
  | "max"
  | "size"
  | "thickness"
  | "color"
  | "formatValue"
  | "orientation"
> & {
  "aria-describedby"?: string;
};

export type ProgressBarTrackAriaProps = {
  clampedValue: number;
  min: number;
  max: number;
  statusText: string;
  indeterminate: boolean;
  labelId?: string;
  ariaDescribedBy?: string;
};

export type ProgressBarSimpleBodyProps = {
  label?: ReactNode;
  showValue?: boolean;
  valueText?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  trackProps: Partial<ProgressBarTrackProps>;
};
