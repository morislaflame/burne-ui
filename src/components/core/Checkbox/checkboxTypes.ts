import type {
  ChangeEvent,
  HTMLAttributes,
  InputHTMLAttributes,
  KeyboardEvent,
  LabelHTMLAttributes,
  PointerEvent,
  ReactNode,
  RefObject,
} from "react";
import type { Prettify } from "@/utils/prettify";

import type { FieldErrorProps, FieldHintProps } from "@/components/core/Field";
import type { LabelProps } from "@/components/core/Label";
import type { MotionController, MotionMapWithEvents, MotionValue, MotionStateHostProps } from "@/components/core/utils/slotMotion";
import type { SelectionIndicatorClassNames, SelectionIndicatorMotion } from "@/components/core/SelectionIndicator";
import type { SemanticStatus } from "@/components/core/utils/semanticStatusIcons";

export type CheckboxVariant = "default" | "secondary" | "outline" | "gloss";

export type CheckboxSize = "small" | "base" | "mid" | "large";

export type CheckboxClassNames = {
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

export type CheckboxCheckMotion = {
  check?: MotionValue;
  uncheck?: MotionValue;
  enter?: MotionValue;
  leave?: MotionValue;
};

/** Root map. Indicator keys → SelectionIndicator; chrome (`label` / `hint` / `error`) is Checkbox's own scope. */
export type CheckboxMotion = {
  indicator?: CheckboxCheckMotion;
  indicatorFill?: CheckboxCheckMotion;
  indicatorMark?: CheckboxCheckMotion;
  label?: CheckboxCheckMotion;
  hint?: CheckboxCheckMotion;
  error?: CheckboxCheckMotion;
};

export type CheckboxProps = Omit<
  LabelHTMLAttributes<HTMLLabelElement>,
  "children" | "htmlFor" | "onChange" | "onPointerDown"
> &
  Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "children" | "className"> & {
    children?: ReactNode;
    label?: ReactNode;
    hint?: ReactNode;
    error?: ReactNode;
    size?: CheckboxSize;
    variant?: CheckboxVariant;
    status?: SemanticStatus;
    icon?: ReactNode;
    className?: string;
    classNames?: Prettify<CheckboxClassNames>;
    /**
     * Per-slot motion. Indicator keys map onto SelectionIndicator; chrome (`label` / `hint` / `error`)
     * is Checkbox's own scope. `events` — namespaced app commands for `MotionController.play`.
     * Simple API: `motionController` is forwarded to the indicator host.
     * Compound: this handle attaches to the Root chrome scope; pass another handle on `Checkbox.Indicator`.
     */
    motion?: Prettify<MotionMapWithEvents<CheckboxMotion>>;
    /**
     * Deferred handle from `createMotionController()` / `useMotionControllerHandle()`.
     * Simple API: forwarded to SelectionIndicator. Compound: Root chrome scope.
     * Not placed on the DOM.
     */
    motionController?: MotionController;
    onPointerDown?: (e: PointerEvent<HTMLElement>) => void;
  } & MotionStateHostProps;


export type CheckboxControlProps = HTMLAttributes<HTMLSpanElement> & {
  /**
   * Forwarded to an auto-created `Checkbox.Indicator` (simple / Control without an Indicator child).
   * Explicit `<Checkbox.Indicator motionController>` wins on that nested host.
   */
  motionController?: MotionController;
} & MotionStateHostProps;

export type CheckboxIndicatorClassNames = SelectionIndicatorClassNames &
  Partial<Pick<CheckboxClassNames, "indicator" | "indicatorFill" | "indicatorMark">>;

export type CheckboxIndicatorProps = HTMLAttributes<HTMLSpanElement> & {
  children?: ReactNode;
  size?: CheckboxSize;
  classNames?: Prettify<CheckboxIndicatorClassNames>;
  motion?: Prettify<MotionMapWithEvents<SelectionIndicatorMotion>>;
  /**
   * Handle for the SelectionIndicator host (`root` / `fill` / `mark`).
   * Simple API: pass `motionController` on `Checkbox` — it is forwarded here.
   */
  motionController?: MotionController;
} & MotionStateHostProps;

export type CheckboxContentProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

export type CheckboxLabelProps = Omit<LabelProps, "htmlFor"> & {
  motion?: Prettify<CheckboxCheckMotion>;
};

export type CheckboxHintProps = Omit<FieldHintProps, "id" | "as" | "motion"> & {
  motion?: Prettify<CheckboxCheckMotion>;
};

export type CheckboxErrorProps = Omit<FieldErrorProps, "id" | "as" | "motion"> & {
  motion?: Prettify<CheckboxCheckMotion>;
};

export type CheckboxFieldContextValue = {
  inputId: string;
  hintId: string;
  errorId: string;
  labelId: string;
  size: CheckboxSize;
  variant: CheckboxVariant;
  mergedChecked: boolean;
  isDisabled: boolean;
  isControlled: boolean;
  isCompound: boolean;
  hasCompoundHint: boolean;
  hasCompoundError: boolean;
  useInlineCompoundMotion: boolean;
  textMotionRef: RefObject<HTMLElement | null>;
  hintConnected: boolean;
  errorConnected: boolean;
  labelConnected: boolean;
  accessibleName?: string;
  status: SemanticStatus;
  icon?: ReactNode;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  inputProps: {
    name?: string;
    value?: InputHTMLAttributes<HTMLInputElement>["value"];
    defaultChecked?: boolean;
    required?: boolean;
    form?: string;
    autoFocus?: boolean;
    tabIndex?: number;
    readOnly?: boolean;
    onBlur?: InputHTMLAttributes<HTMLInputElement>["onBlur"];
    onFocus?: InputHTMLAttributes<HTMLInputElement>["onFocus"];
    inputRef?: (node: HTMLInputElement | null) => void;
    ariaInvalid?: boolean | "false" | "true" | "grammar" | "spelling";
  };
};

export type CheckboxClassNamesProviderProps = {
  classNames?: Prettify<CheckboxClassNames>;
  children: ReactNode;
};

export type CheckboxMotionProviderProps = {
  motion?: Prettify<MotionMapWithEvents<CheckboxMotion>>;
  controller?: MotionController;
  children: ReactNode;
};

export type UseCheckboxRootStateProps = Omit<
  CheckboxProps,
  "children" | "className" | "classNames" | "motion" | "motionController" | "motionState" | "motionPayload" | "playInitialState"
>;

export type UseCheckboxAnimationsProps = {
  isDisabled: boolean;
  enableTextMotion: boolean;
  textMotionRef: RefObject<HTMLElement | null>;
  onPointerDown?: (e: PointerEvent<HTMLElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLElement>) => void;
};
