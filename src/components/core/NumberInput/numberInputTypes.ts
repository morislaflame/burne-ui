import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, ReactNode, RefObject } from "react";
import type { Prettify } from "@/utils/prettify";

import type { InputSize, InputVariant } from "@/components/core/Input";
import type {
  MotionController,
  MotionMapWithEvents,
  MotionStateHostProps,
  MotionValue,
} from "@/components/core/utils/slotMotion";

export type NumberInputSize = InputSize;
export type NumberInputVariant = InputVariant;

export type NumberInputClassNames = {
  root?: string;
  label?: string;
  shell?: string;
  control?: string;
  decrement?: string;
  increment?: string;
  hint?: string;
  error?: string;
};

export type NumberInputPartMotion = {
  hoverIn?: MotionValue;
  hoverOut?: MotionValue;
  pressIn?: MotionValue;
  pressOut?: MotionValue;
  enter?: MotionValue;
  leave?: MotionValue;
};

/** DOM slots: `shell` (host), `control`, `decrement`, `increment`, `label`, `hint`, `error`. */
export type NumberInputMotion = {
  shell?: NumberInputPartMotion;
  control?: NumberInputPartMotion;
  decrement?: NumberInputPartMotion;
  increment?: NumberInputPartMotion;
  label?: NumberInputPartMotion;
  hint?: NumberInputPartMotion;
  error?: NumberInputPartMotion;
};

export type NumberInputProps = Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> &
  MotionStateHostProps & {
    children?: ReactNode;
    label?: ReactNode;
    hint?: ReactNode;
    error?: ReactNode;
    /** Danger visual, `aria-invalid`, and `data-invalid`. `error` does the same and shows the message. */
    invalid?: boolean;
    id?: string;
    name?: string;
    required?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    size?: InputSize;
    variant?: InputVariant;
    placeholder?: string;
    value?: number | null;
    defaultValue?: number | null;
    onValueChange?: (value: number | null) => void;
    min?: number;
    max?: number;
    /** Added or subtracted by the steppers and by ArrowUp / ArrowDown. Default `1`. */
    step?: number;
    /** Passed to `Intl.NumberFormat` for the committed display. Focus shows the raw number. */
    formatOptions?: Intl.NumberFormatOptions;
    /** `Intl` locale. Default `en`, so the server and the browser format the same string. */
    locale?: string;
    classNames?: Prettify<NumberInputClassNames>;
    motion?: Prettify<MotionMapWithEvents<NumberInputMotion>>;
    motionController?: MotionController;
  };

export type NumberInputLabelProps = HTMLAttributes<HTMLElement> & {
  children?: ReactNode;
  motion?: Prettify<NumberInputPartMotion>;
};

export type NumberInputControlProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "type" | "value" | "defaultValue" | "onChange" | "min" | "max" | "step"
> & {
  motion?: Prettify<NumberInputPartMotion>;
};

export type NumberInputStepperProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  motion?: Prettify<NumberInputPartMotion>;
};

export type NumberInputHintProps = HTMLAttributes<HTMLElement> & {
  children?: ReactNode;
  motion?: Prettify<NumberInputPartMotion>;
};

export type NumberInputErrorProps = HTMLAttributes<HTMLElement> & {
  children?: ReactNode;
  motion?: Prettify<NumberInputPartMotion>;
};

export type NumberInputContextValue = {
  value: number | null;
  text: string;
  valueText?: string;
  beginEdit: () => void;
  nudge: (direction: 1 | -1) => void;
  commitInput: (raw: string) => void;
  commitBlur: () => void;
  canDecrement: boolean;
  canIncrement: boolean;
  disabled: boolean;
  readOnly: boolean;
  placeholder?: string;
  size: InputSize;
  variant: InputVariant;
  min?: number;
  max?: number;
  step: number;
  inputId: string;
  labelId: string;
  hintId: string;
  errorId: string;
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  name?: string;
  required: boolean;
  isInvalid: boolean;
  labelConnected: boolean;
  hintConnected: boolean;
  errorConnected: boolean;
  describedBy?: string;
  inputRef: RefObject<HTMLInputElement | null>;
  setInputRef: (node: HTMLInputElement | null) => void;
  pointerInsideRef: RefObject<boolean>;
};
