import type {
  CSSProperties,
  HTMLAttributes,
  ReactNode,
} from "react";

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
};

export type ProgressBarProps = HTMLAttributes<HTMLDivElement> &
  Partial<ProgressBarTrackProps> & {
    children?: ReactNode;
    id?: string;
    orientation?: ProgressBarOrientation;
    label?: ReactNode;
    showValue?: boolean;
    valueText?: ReactNode;
    hint?: ReactNode;
    error?: ReactNode;
    classNames?: ProgressBarClassNames;
  };

export type ProgressBarClassNamesProviderProps = {
  classNames?: ProgressBarClassNames;
  children: ReactNode;
};

export type ProgressBarHeaderProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

export type ProgressBarValueProps = HTMLAttributes<HTMLSpanElement> & {
  children?: ReactNode;
};

export type ProgressBarHintProps = HTMLAttributes<HTMLParagraphElement> & {
  children?: ReactNode;
};

export type ProgressBarErrorProps = HTMLAttributes<HTMLParagraphElement> & {
  children?: ReactNode;
};

export type UseProgressBarRootStateProps = Omit<
  ProgressBarProps,
  "className" | "classNames"
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

export type UseProgressBarFillAnimationProps = {
  indeterminate: boolean;
  fillTargetStyle: CSSProperties;
  isHorizontal: boolean;
};

export type ProgressBarSimpleBodyProps = {
  label?: ReactNode;
  showValue?: boolean;
  valueText?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  trackProps: Partial<ProgressBarTrackProps>;
};
