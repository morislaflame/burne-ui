import type { HTMLAttributes, ReactNode } from "react";
import type { Prettify } from "@/utils/prettify";

import type { InputSize, InputStatus, InputVariant } from "@/components/core/Input";
import type {
  MotionController,
  MotionMapWithEvents,
  MotionStateHostProps,
  MotionValue,
} from "@/components/core/utils/slotMotion";

export type PinInputType = "number" | "text";

export type PinInputClassNames = {
  root?: string;
  label?: string;
  group?: string;
  field?: string;
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

/** DOM slots: `group`, `field` (one per cell), `label`, `hint`, `error`. */
export type PinInputMotion = {
  group?: PinInputPartMotion;
  field?: PinInputPartMotion;
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
    status?: InputStatus;
    size?: InputSize;
    variant?: InputVariant;
    /** Shown in every empty cell. One glyph. */
    placeholder?: string;
    /** Joined cell text. Empty cells are omitted; the string grows from the start. */
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    /** How many cells. Default `6`. Clamped to 1…12. */
    length?: number;
    /** `number` keeps digits. `text` keeps letters and digits. Default `number`. */
    type?: PinInputType;
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

export type PinInputGroupProps = HTMLAttributes<HTMLDivElement> & {
  motion?: Prettify<PinInputPartMotion>;
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
  status: InputStatus;
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
