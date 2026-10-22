import type {
  ChangeEvent,
  HTMLAttributes,
  InputHTMLAttributes,
  KeyboardEvent,
  LabelHTMLAttributes,
  MouseEvent,
  PointerEvent,
  ReactNode,
  Ref,
  RefObject,
} from "react";
import type { Prettify } from "@/utils/prettify";
 
import type { FieldErrorProps, FieldHintProps } from "@/components/core/Field";
import type { LabelProps } from "@/components/core/Label";
import type { MotionController, MotionMapWithEvents, MotionValue, MotionStateHostProps } from "@/components/core/utils/slotMotion";
import type { IconPosition } from "@/components/core/utils/iconPosition";
import type { ComponentSize } from "@/components/core/utils/sizeLayout";
import type { SelectionIndicatorClassNames, SelectionIndicatorMotion } from "@/components/core/SelectionIndicator";
 
export const KIT_RADIO_VARIANTS = ["default", "secondary", "outline"] as const;
export type KitRadioVariant = (typeof KIT_RADIO_VARIANTS)[number];
export type RadioVariant = KitRadioVariant | (string & {});
 
export type RadioSize = ComponentSize;
export type RadioLabelPosition = IconPosition;
 
export type RadioClassNames = {
  root?: string;
  control?: string;
  controlTrack?: string;
  indicator?: string;
  indicatorFill?: string;
  indicatorMark?: string;
  content?: string;
  label?: string;
  labelText?: string;
  requiredMark?: string;
  hint?: string;
  error?: string;
  simpleLabelWrap?: string;
  simpleLabelText?: string;
  input?: string;
};
 
export type RadioPartMotion = {
  check?: MotionValue;
  uncheck?: MotionValue;
  enter?: MotionValue;
  leave?: MotionValue;
};
 
/** Root map. Indicator keys → SelectionIndicator; chrome (`label` / `hint` / `error`) is Radio's own scope. */
export type RadioMotion = {
  indicator?: RadioPartMotion;
  indicatorFill?: RadioPartMotion;
  indicatorMark?: RadioPartMotion;
  label?: RadioPartMotion;
  hint?: RadioPartMotion;
  error?: RadioPartMotion;
};
 
export type RadioProps = Omit<
  LabelHTMLAttributes<HTMLLabelElement>,
  "children" | "htmlFor" | "onChange" | "onPointerDown"
> &
  Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "children" | "className"> & {
    children?: ReactNode;
    label?: ReactNode;
    hint?: ReactNode;
    error?: ReactNode;
    /** Danger label, `aria-invalid`, and `data-invalid`. `error` does the same and shows the message. */
    invalid?: boolean;
    size?: RadioSize;
    /** Label side. Default `end` (control, then label). */
    labelPosition?: RadioLabelPosition;
    variant?: RadioVariant;
    className?: string;
    classNames?: Prettify<RadioClassNames>;
    /** Native `<input type="radio">`. Root `ref` stays on the `<label>`. */
    inputRef?: Ref<HTMLInputElement>;
    /**
     * Per-slot motion. Indicator keys map onto SelectionIndicator; chrome (`label` / `hint` / `error`)
     * is Radio's own scope. `events` — namespaced app commands for `MotionController.play`.
     * Simple API: `motionController` is forwarded to the indicator host.
     * Compound: this handle attaches to the Root chrome scope; pass another handle on `Radio.Indicator`.
     */
    motion?: Prettify<MotionMapWithEvents<RadioMotion>>;
    /**
     * Deferred handle from `createMotionController()` / `useMotionControllerHandle()`.
     * Simple API: forwarded to SelectionIndicator. Compound: Root chrome scope.
     * Not placed on the DOM.
     */
    motionController?: MotionController;
    onPointerDown?: (e: PointerEvent<HTMLLabelElement>) => void;
  } & MotionStateHostProps;
 
 
export type RadioControlProps = HTMLAttributes<HTMLSpanElement> & {
  /**
   * Forwarded to an auto-created `Radio.Indicator` (simple / Control without an Indicator child).
   * Explicit `<Radio.Indicator motionController>` wins on that nested host.
   */
  motionController?: MotionController;
} & MotionStateHostProps;
 
export type RadioIndicatorClassNames = SelectionIndicatorClassNames &
  Partial<Pick<RadioClassNames, "indicator" | "indicatorFill" | "indicatorMark">>;
 
export type RadioIndicatorProps = HTMLAttributes<HTMLSpanElement> & {
  children?: ReactNode;
  /** Mark icon. Replaces the dot. */
  icon?: ReactNode;
  size?: RadioSize;
  classNames?: Prettify<RadioIndicatorClassNames>;
  motion?: Prettify<MotionMapWithEvents<SelectionIndicatorMotion>>;
  /**
   * Handle for the SelectionIndicator host (`root` / `fill` / `mark`).
   * Simple API: pass `motionController` on `Radio` — it is forwarded here.
   */
  motionController?: MotionController;
} & MotionStateHostProps;
 
/** `display: contents` — padding, border, background and width do not paint. Not a motion target. */
export type RadioContentProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};
 
export type RadioLabelProps = Omit<LabelProps, "htmlFor"> & {
  motion?: Prettify<RadioPartMotion>;
};
 
export type RadioHintProps = Omit<FieldHintProps, "id" | "as" | "motion" | "status"> & {
  motion?: Prettify<RadioPartMotion>;
};
 
export type RadioErrorProps = Omit<FieldErrorProps, "id" | "as" | "motion"> & {
  motion?: Prettify<RadioPartMotion>;
};
 
export type RadioFieldContextValue = {
  inputId: string;
  hintId: string;
  errorId: string;
  size: RadioSize;
  labelPosition: RadioLabelPosition;
  variant: RadioVariant;
  mergedChecked: boolean;
  isDisabled: boolean;
  isControlled: boolean;
  isCompound: boolean;
  hasCompoundHint: boolean;
  hasCompoundError: boolean;
  hintConnected: boolean;
  errorConnected: boolean;
  isInvalid: boolean;
  /** Visible label present (simple `label` or compound `Radio.Label`) — skips fallback `aria-label`. */
  hasLabel: boolean;
  useInlineCompoundMotion: boolean;
  textMotionRef: RefObject<HTMLElement | null>;
  danger: boolean;
  inputName?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onActivate?: (e: MouseEvent<HTMLInputElement>) => void;
  inputProps: {
    value?: InputHTMLAttributes<HTMLInputElement>["value"];
    defaultChecked?: boolean;
    required?: boolean;
    form?: string;
    autoFocus?: boolean;
    tabIndex?: number;
    readOnly?: boolean;
    onBlur?: InputHTMLAttributes<HTMLInputElement>["onBlur"];
    onFocus?: InputHTMLAttributes<HTMLInputElement>["onFocus"];
    inputRef?: Ref<HTMLInputElement>;
  };
};
 
export type RadioClassNamesProviderProps = {
  classNames?: Prettify<RadioClassNames>;
  children: ReactNode;
};
 
export type RadioMotionProviderProps = {
  motion?: Prettify<MotionMapWithEvents<RadioMotion>>;
  controller?: MotionController;
  children: ReactNode;
};
 
export type UseRadioRootStateProps = Omit<
  RadioProps,
  "children" | "className" | "classNames" | "onPointerDown" | "onClick" | "motion" | "motionController" | "motionState" | "motionPayload" | "playInitialState"
>;
 
export type UseRadioAnimationsProps = {
  isDisabled: boolean;
  enableTextMotion: boolean;
  textMotionRef: RefObject<HTMLElement | null>;
  onPointerDown?: (e: PointerEvent<HTMLLabelElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLLabelElement>) => void;
};
 