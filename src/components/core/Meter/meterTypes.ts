import type {
  HTMLAttributes,
  ReactNode,
} from "react";
import type { Prettify } from "@/utils/prettify";
import type { LabelProps } from "@/components/core/Label";
import type { MotionController, MotionMapWithEvents, MotionValue, MotionStateHostProps } from "@/components/core/utils/slotMotion";

export type MeterSize = "small" | "base" | "mid" | "large";

export type MeterOrientation = "horizontal" | "vertical";

export type MeterClassNames = {
  /** Field root (`Field`). */
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

export type MeterPartMotion = {
  hoverIn?: MotionValue;
  hoverOut?: MotionValue;
  pressIn?: MotionValue;
  pressOut?: MotionValue;
  enter?: MotionValue;
  leave?: MotionValue;
  /**
   * `track`: value identity.
   * `fill`: `progressFill` (scale). Opt-in `fill.enter` — first paint at 0,
   * then fill to `getProgressScale()`.
   */
  change?: MotionValue;
};

export type MeterMotion = {
  track?: MeterPartMotion;
  fill?: MeterPartMotion;
  header?: MeterPartMotion;
  value?: MeterPartMotion;
  label?: MeterPartMotion;
  hint?: MeterPartMotion;
  error?: MeterPartMotion;
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
  motion?: Prettify<MeterPartMotion>;
  /**
   * Deferred handle for the Track fill host (`track`, `fill`). One handle → this nested scope.
   * Simple API: pass `motionController` on `Meter` — it is forwarded here.
   */
  motionController?: MotionController;
} & MotionStateHostProps;

export type MeterProps = HTMLAttributes<HTMLDivElement> &
  Partial<Omit<MeterTrackProps, "motion">> & {
    children?: ReactNode;
    id?: string;
    orientation?: MeterOrientation;
    label?: ReactNode;
    showValue?: boolean;
    valueText?: ReactNode;
    hint?: ReactNode;
    error?: ReactNode;
    classNames?: Prettify<MeterClassNames>;
    /**
     * Per-slot motion (`track`, `fill`, `header`, `value`, `label`, `hint`, `error`).
     * Fill `change` defaults to `progressFill`. `fill.enter` is opt-in
     * (`"progressFill"` or a factory with `ctx.params.getProgressScale`).
     * Chrome registers on the Root scope (siblings of Track). Track is the nested fill host.
     * `events` — namespaced app commands for `MotionController.play` (not a DOM slot).
     * Simple API: `motionController` is forwarded to `Meter.Track` (fill host).
     * Compound: this handle attaches to the Root chrome scope; pass another handle on `Track`.
     */
    motion?: Prettify<MotionMapWithEvents<MeterMotion>>;
    /**
     * Deferred handle from `createMotionController()` / `useMotionControllerHandle()`.
     * Simple API: forwarded to the Track nested Provider. Compound: Root chrome scope.
     * Not placed on the DOM.
     */
    motionController?: MotionController;
  } & MotionStateHostProps;

export type MeterClassNamesProviderProps = {
  classNames?: Prettify<MeterClassNames>;
  children: ReactNode;
};

export type MeterHeaderProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  motion?: Prettify<MeterPartMotion>;
};

export type MeterValueProps = HTMLAttributes<HTMLSpanElement> & {
  children?: ReactNode;
  motion?: Prettify<MeterPartMotion>;
};

export type MeterLabelProps = Omit<LabelProps, "motion"> & {
  motion?: Prettify<MeterPartMotion>;
};

export type MeterHintProps = HTMLAttributes<HTMLParagraphElement> & {
  children?: ReactNode;
  motion?: Prettify<MeterPartMotion>;
};

export type MeterErrorProps = HTMLAttributes<HTMLParagraphElement> & {
  children?: ReactNode;
  motion?: Prettify<MeterPartMotion>;
};

export type UseMeterRootStateProps = Omit<
  MeterProps,
  "className" | "classNames" | "motion" | "motionController" | "motionState" | "motionPayload" | "playInitialState"
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

export type MeterSimpleBodyProps = {
  label?: ReactNode;
  showValue?: boolean;
  valueText?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  trackProps: Partial<MeterTrackProps> & { value?: number };
};
