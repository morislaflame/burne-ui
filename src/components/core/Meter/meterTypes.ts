import type {
  CSSProperties,
  HTMLAttributes,
  ReactNode,
} from "react";

export type MeterSize = "small" | "base" | "mid" | "large";

export type MeterOrientation = "horizontal" | "vertical";

export type MeterClassNames = {
  /** Field root (`FieldRoot`). */
  root?: string;
  /** Label in simple API and `Meter.Label`. */
  label?: string;
  /** `Meter.Header`. */
  header?: string;
  /** `Meter.Value`. */
  value?: string;
  /** Track `role="meter"`. */
  track?: string;
  /** Track fill. */
  fill?: string;
  /** `Meter.Hint`. */
  hint?: string;
  /** `Meter.Error`. */
  error?: string;
};

export type MeterDisplayState = {
  clampedValue: number;
  statusText: string;
  min: number;
  max: number;
};

export type MeterFieldContextValue = {
  meterId: string;
  hintId: string;
  errorId: string;
  hintConnected: boolean;
  errorConnected: boolean;
  labelConnected: boolean;
  orientation: MeterOrientation;
  display: MeterDisplayState | null;
  setDisplay: (next: MeterDisplayState | null) => void;
};

export type MeterTrackProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  value: number;
  min?: number;
  max?: number;
  size?: MeterSize;
  thickness?: number | string;
  color?: string;
  formatValue?: (value: number) => string;
  orientation?: MeterOrientation;
  className?: string;
};

export type MeterRootProps = HTMLAttributes<HTMLDivElement> &
  Partial<MeterTrackProps> & {
    children?: ReactNode;
    id?: string;
    orientation?: MeterOrientation;
    label?: ReactNode;
    showValue?: boolean;
    valueText?: ReactNode;
    hint?: ReactNode;
    error?: ReactNode;
    classNames?: MeterClassNames;
  };

export type MeterClassNamesProviderProps = {
  classNames?: MeterClassNames;
  children: ReactNode;
};

export type MeterHeaderProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

export type MeterValueProps = HTMLAttributes<HTMLSpanElement> & {
  children?: ReactNode;
};

export type MeterHintProps = HTMLAttributes<HTMLParagraphElement> & {
  children?: ReactNode;
};

export type MeterErrorProps = HTMLAttributes<HTMLParagraphElement> & {
  children?: ReactNode;
};

export type UseMeterRootStateProps = Omit<
  MeterRootProps,
  "className" | "classNames"
>;

export type UseMeterTrackStateProps = Pick<
  MeterTrackProps,
  | "value"
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

export type MeterTrackAriaProps = {
  clampedValue: number;
  min: number;
  max: number;
  statusText: string;
  labelConnected: boolean;
  labelId?: string;
  ariaDescribedBy?: string;
};

export type UseMeterFillAnimationProps = {
  fillTargetStyle: CSSProperties;
  isHorizontal: boolean;
};

export type MeterSimpleBodyProps = {
  label?: ReactNode;
  showValue?: boolean;
  valueText?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  trackProps: Partial<MeterTrackProps> & { value?: number };
};
