import type { HTMLAttributes, ReactNode } from "react";
import type { Prettify } from "@/utils/prettify";

import type { InputSize, InputStatus, InputVariant } from "@/components/core/Input";
import type {
  MotionController,
  MotionMapWithEvents,
  MotionStateHostProps,
  MotionValue,
} from "@/components/core/utils/slotMotion";

export type TagsInputClassNames = {
  root?: string;
  label?: string;
  shell?: string;
  tag?: string;
  remove?: string;
  input?: string;
  hint?: string;
  error?: string;
};

export type TagsInputPartMotion = {
  hoverIn?: MotionValue;
  hoverOut?: MotionValue;
  pressIn?: MotionValue;
  pressOut?: MotionValue;
  enter?: MotionValue;
  leave?: MotionValue;
};

/** DOM slots: `shell`, `tag` (one per chip), `remove`, `input`, `label`, `hint`, `error`. */
export type TagsInputMotion = {
  shell?: TagsInputPartMotion;
  tag?: TagsInputPartMotion;
  remove?: TagsInputPartMotion;
  input?: TagsInputPartMotion;
  label?: TagsInputPartMotion;
  hint?: TagsInputPartMotion;
  error?: TagsInputPartMotion;
};

export type TagsInputProps = Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> &
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
    placeholder?: string;
    /** Chip values, in order. Duplicates and blank text are ignored. */
    values?: string[];
    defaultValues?: string[];
    onValuesChange?: (values: string[]) => void;
    /** Stop adding once this many chips are present. */
    max?: number;
    classNames?: Prettify<TagsInputClassNames>;
    motion?: Prettify<MotionMapWithEvents<TagsInputMotion>>;
    motionController?: MotionController;
  };

export type TagsInputLabelProps = HTMLAttributes<HTMLElement> & {
  children?: ReactNode;
  motion?: Prettify<TagsInputPartMotion>;
};

export type TagsInputControlProps = HTMLAttributes<HTMLDivElement> & {
  motion?: Prettify<TagsInputPartMotion>;
};

export type TagsInputHintProps = HTMLAttributes<HTMLElement> & {
  children?: ReactNode;
  motion?: Prettify<TagsInputPartMotion>;
};

export type TagsInputErrorProps = HTMLAttributes<HTMLElement> & {
  children?: ReactNode;
  motion?: Prettify<TagsInputPartMotion>;
};

export type TagsInputContextValue = {
  values: string[];
  append: (incoming: readonly string[]) => void;
  remove: (value: string) => void;
  removeLast: () => void;
  disabled: boolean;
  readOnly: boolean;
  atMax: boolean;
  size: InputSize;
  variant: InputVariant;
  status: InputStatus;
  placeholder?: string;
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
