import type {
  HTMLAttributes,
  KeyboardEvent,
  PointerEvent,
  ReactNode,
  RefObject,
} from "react";

export type SliderOrientation = "horizontal" | "vertical";

export type SliderSize = "small" | "base" | "mid" | "large";

export type SliderThickness = number | string;

export type SliderThumbKind = "single" | "start" | "end";

export type SliderClassNames = {
  root?: string;
  label?: string;
  header?: string;
  value?: string;
  hint?: string;
  error?: string;
  track?: string;
  rail?: string;
  fill?: string;
  thumb?: string;
  thumbShell?: string;
  mark?: string;
};

export type SliderDisplayState = {
  valueLabel: string;
  min: number;
  max: number;
  range: boolean;
  singleValue: number;
  rangeValue: [number, number];
  label?: string;
};

export type SliderFieldContextValue = {
  sliderId: string;
  labelId: string;
  hintId: string;
  errorId: string;
  hintConnected: boolean;
  errorConnected: boolean;
  labelConnected: boolean;
  orientation: SliderOrientation;
  display: SliderDisplayState | null;
  setDisplay: (next: SliderDisplayState | null) => void;
};

export type SliderTrackContextValue = {
  fillRef: RefObject<HTMLSpanElement | null>;
  fillClassResolved: string;
  railClass: string;
  markNodes: ReactNode;
  size: SliderSize;
  orientation: SliderOrientation;
  disabled?: boolean;
  icon?: ReactNode;
  range: boolean;
  renderThumb: (kind: SliderThumbKind, iconOverride?: ReactNode) => ReactNode;
};

type SliderCommonProps = {
  orientation?: SliderOrientation;
  size?: SliderSize;
  thickness?: number | string;
  min?: number;
  max?: number;
  step?: number;
  marks?: number[];
  formatValue?: (value: number) => string;
  icon?: ReactNode;
  gloss?: boolean;
  thumbClassName?: string;
  disabled?: boolean;
  className?: string;
  classNames?: Pick<
    SliderClassNames,
    "track" | "rail" | "fill" | "thumb" | "thumbShell" | "mark"
  >;
  ariaLabel?: string;
  children?: ReactNode;
};

export type SliderSingleProps = SliderCommonProps & {
  range?: false;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
};

export type SliderRangeProps = SliderCommonProps & {
  range: true;
  value?: [number, number];
  defaultValue?: [number, number];
  onValueChange?: (value: [number, number]) => void;
};

export type SliderTrackProps = SliderSingleProps | SliderRangeProps;

export type SliderRootProps = Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "value"> & {
  children?: ReactNode;
  id?: string;
  orientation?: SliderOrientation;
  label?: ReactNode;
  showValue?: boolean;
  valueText?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  classNames?: SliderClassNames;
} & (
    | Partial<Omit<SliderSingleProps, "orientation" | "className" | "classNames">>
    | Partial<Omit<SliderRangeProps, "orientation" | "className" | "classNames">>
  );

export type SliderClassNamesProviderProps = {
  classNames?: SliderClassNames;
  children: ReactNode;
};

export type SliderHeaderProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

export type SliderValueProps = HTMLAttributes<HTMLSpanElement> & {
  children?: ReactNode;
};

export type SliderHintProps = HTMLAttributes<HTMLParagraphElement> & {
  children?: ReactNode;
};

export type SliderErrorProps = HTMLAttributes<HTMLParagraphElement> & {
  children?: ReactNode;
};

export type SliderFillProps = HTMLAttributes<HTMLSpanElement>;

export type SliderRailProps = HTMLAttributes<HTMLDivElement>;

export type SliderCompoundThumbProps = {
  thumb?: SliderThumbKind;
  children?: ReactNode;
};

export type SliderIconProps = {
  children?: ReactNode;
};

export type SliderThumbProps = SliderCompoundThumbProps;

export type SliderThumbButtonProps = {
  size: SliderSize;
  icon?: ReactNode;
  gloss?: boolean;
  thumbClassName?: string;
  percent: number;
  orientation: SliderOrientation;
  disabled?: boolean;
  active: boolean;
  ariaValueNow: number;
  ariaValueMin: number;
  ariaValueMax: number;
  ariaValueText?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  onPointerDown: (e: PointerEvent<HTMLButtonElement>) => void;
  onKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => void;
};

export type UseSliderRootStateProps = Omit<SliderRootProps, "className" | "classNames">;

export type FillSpan = { start: number; end: number };
