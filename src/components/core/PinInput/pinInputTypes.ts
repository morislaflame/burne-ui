import type { HTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import type { Prettify } from "@/utils/prettify";

import type { InputSize, InputVariant } from "@/components/core/Input";
import type {
  MotionController,
  MotionMapWithEvents,
  MotionStateHostProps,
  MotionValue,
} from "@/components/core/utils/slotMotion";

export type PinInputType = "number" | "text";
export type PinInputSize = InputSize;
export type PinInputVariant = InputVariant;

export type PinInputClassNames = {
  root?: string;
  label?: string;
  /** Row around the cells. */
  shell?: string;
  /** One cell `<input>`. */
  control?: string;
  separator?: string;
  hint?: string;
  error?: string;
};

export type PinInputPartMotion = {
  hoverIn?: MotionValue;
  hoverOut?: MotionValue;
  pressIn?: MotionValue;
  pressOut?: MotionValue;
  enter?: MotionValue;
  leave?: MotionValue;
};

/** DOM slots: `shell` (row), `control` (one per cell), `label`, `hint`, `error`. */
export type PinInputMotion = {
  shell?: PinInputPartMotion;
  control?: PinInputPartMotion;
  label?: PinInputPartMotion;
  hint?: PinInputPartMotion;
  error?: PinInputPartMotion;
};

export type PinInputProps = Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> &
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
    /** Shown in every empty cell. One glyph. */
    placeholder?: string;
    /** Joined cell text. Empty cells are omitted; the string grows from the start. */
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    /** Fires when the last empty cell is filled. */
    onComplete?: (value: string) => void;
    /** How many cells. Default `6`. Clamped to 1…12. */
    length?: number;
    /** `number` keeps digits. `text` keeps letters and digits. Default `number`. */
    charset?: PinInputType;
    /** Render cells as password dots. */
    mask?: boolean;
    /** Drawn once, after the first half of the cells. */
    separator?: ReactNode;
    classNames?: Prettify<PinInputClassNames>;
    motion?: Prettify<MotionMapWithEvents<PinInputMotion>>;
    motionController?: MotionController;
  };

export type PinInputLabelProps = HTMLAttributes<HTMLElement> & {
  children?: ReactNode;
  motion?: Prettify<PinInputPartMotion>;
};

export type PinInputShellProps = HTMLAttributes<HTMLDivElement> & {
  motion?: Prettify<PinInputPartMotion>;
};

export type PinInputControlProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "defaultValue" | "onChange" | "size" | "type" | "children"
> & {
  /**
   * Cell index, from 0. `PinInput.Shell` assigns it in order when omitted.
   * Set it when the field order is not the cell order.
   */
  index?: number;
};

export type PinInputHintProps = HTMLAttributes<HTMLElement> & {
  children?: ReactNode;
  motion?: Prettify<PinInputPartMotion>;
};

export type PinInputErrorProps = HTMLAttributes<HTMLElement> & {
  children?: ReactNode;
  motion?: Prettify<PinInputPartMotion>;
};

export type PinInputContextValue = {
  value: string;
  length: number;
  type: PinInputType;
  mask: boolean;
  placeholder?: string;
  separator?: ReactNode;
  write: (index: number, char: string) => number;
  paste: (index: number, text: string) => number;
  remove: (index: number) => number;
  disabled: boolean;
  readOnly: boolean;
  size: InputSize;
  variant: InputVariant;
  inputId: string;
  labelId: string;
  hintId: string;
  errorId: string;
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  name?: string;
  labelled: boolean;
  required: boolean;
  isInvalid: boolean;
  describedBy?: string;
};
