import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode, RefObject } from "react";
import type { Prettify } from "@/utils/prettify";

import type { CalendarLocale, CalendarRangeValue } from "@/components/core/Calendar";
import type { InputSize, InputStatus, InputVariant } from "@/components/core/Input";
import type { PopoverSide } from "@/components/core/Popover";
import type {
  MotionController,
  MotionMapWithEvents,
  MotionStateHostProps,
  MotionValue,
} from "@/components/core/utils/slotMotion";

export type DatePickerMode = "single" | "range";

export type DatePickerClassNames = {
  root?: string;
  label?: string;
  trigger?: string;
  value?: string;
  icon?: string;
  popover?: string;
  calendar?: string;
  hint?: string;
  error?: string;
};

export type DatePickerPartMotion = {
  hoverIn?: MotionValue;
  hoverOut?: MotionValue;
  pressIn?: MotionValue;
  pressOut?: MotionValue;
  enter?: MotionValue;
  leave?: MotionValue;
};

/** DOM slots: `trigger` (host), `icon`, `label`, `hint`, `error`. */
export type DatePickerMotion = {
  trigger?: DatePickerPartMotion;
  icon?: DatePickerPartMotion;
  label?: DatePickerPartMotion;
  hint?: DatePickerPartMotion;
  error?: DatePickerPartMotion;
};

type DatePickerSharedProps = Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> &
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
    status?: InputStatus;
    size?: InputSize;
    disabled?: boolean;
    placeholder?: string;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    variant?: InputVariant;
    locale?: string | CalendarLocale;
    minDate?: Date;
    maxDate?: Date;
    /** Month shown before a value is chosen. */
    defaultMonth?: Date;
    side?: PopoverSide;
    classNames?: Prettify<DatePickerClassNames>;
    motion?: Prettify<MotionMapWithEvents<DatePickerMotion>>;
    motionController?: MotionController;
  };

export type DatePickerSingleProps = DatePickerSharedProps & {
  mode?: "single";
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (value: Date | null) => void;
};

export type DatePickerRangeProps = DatePickerSharedProps & {
  mode: "range";
  value?: CalendarRangeValue;
  defaultValue?: CalendarRangeValue;
  onValueChange?: (value: CalendarRangeValue) => void;
};

export type DatePickerProps = DatePickerSingleProps | DatePickerRangeProps;

export type DatePickerLabelProps = HTMLAttributes<HTMLElement> & {
  children?: ReactNode;
  motion?: Prettify<DatePickerPartMotion>;
};

export type DatePickerTriggerProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  children?: ReactNode;
  motion?: Prettify<DatePickerPartMotion>;
};

export type DatePickerPopoverProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

export type DatePickerHintProps = HTMLAttributes<HTMLElement> & {
  children?: ReactNode;
  motion?: Prettify<DatePickerPartMotion>;
};

export type DatePickerErrorProps = HTMLAttributes<HTMLElement> & {
  children?: ReactNode;
  motion?: Prettify<DatePickerPartMotion>;
};

export type DatePickerStoredValue = Date | null | CalendarRangeValue;

export type DatePickerContextValue = {
  mode: DatePickerMode;
  value: DatePickerStoredValue;
  commit: (next: DatePickerStoredValue) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  disabled: boolean;
  placeholder: string;
  display: string;
  empty: boolean;
  size: InputSize;
  variant: InputVariant;
  status: InputStatus;
  locale: CalendarLocale;
  minDate?: Date;
  maxDate?: Date;
  defaultMonth?: Date;
  side: PopoverSide;
  triggerId: string;
  panelId: string;
  labelId: string;
  hintId: string;
  errorId: string;
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  name?: string;
  serialized: string;
  required: boolean;
  isInvalid: boolean;
  labelConnected: boolean;
  hintConnected: boolean;
  errorConnected: boolean;
  describedBy?: string;
  triggerRef: RefObject<HTMLButtonElement | null>;
  pointerInsideRef: RefObject<boolean>;
};
