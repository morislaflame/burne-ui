import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode, RefObject } from "react";
import type { Prettify } from "@/utils/prettify";

import type { CalendarLocale, CalendarRangeValue, CalendarView } from "@/components/core/Calendar";
import type { InputSize, InputVariant } from "@/components/core/Input";
import type { PopoverSide } from "@/components/core/Popover";
import type {
  MotionController,
  MotionMapWithEvents,
  MotionStateHostProps,
  MotionValue,
} from "@/components/core/utils/slotMotion";

export type DatePickerMode = "single" | "range" | "multiple";
export type DatePickerSize = InputSize;
export type DatePickerVariant = InputVariant;

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
  /**
   * Menu panel. Forwarded to the inner Popover `content` slot (not registered on the field scope).
   */
  popover?: DatePickerPartMotion;
  /**
   * Nested calendar shell. Forwarded to Calendar `root` (not registered on the field scope).
   */
  calendar?: DatePickerPartMotion;
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
    size?: InputSize;
    /** Chevron beside the value. A node replaces it. `null` hides it. Trigger children still replace the whole trigger. */
    icon?: ReactNode | null;
    disabled?: boolean;
  readOnly?: boolean;
    placeholder?: string;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    variant?: InputVariant;
    locale?: string | CalendarLocale;
    minDate?: Date;
    maxDate?: Date;
    /** Forwarded to the calendar. Unavailable days stay visible and are not selectable. */
    isDateUnavailable?: (date: Date) => boolean;
    /** Month shown before a value is chosen. */
    defaultMonth?: Date;
    /** Controlled visible month. */
    month?: Date;
    onMonthChange?: (month: Date) => void;
    view?: CalendarView;
    defaultView?: CalendarView;
    onViewChange?: (view: CalendarView) => void;
    side?: PopoverSide;
    align?: "start" | "center" | "end";
    offset?: number;
    collisionPadding?: number;
    avoidCollisions?: boolean;
    /** Calendar portal host. Default: `document.body`. */
    portalContainer?: HTMLElement | null;
    classNames?: Prettify<DatePickerClassNames>;
    motion?: Prettify<MotionMapWithEvents<DatePickerMotion>>;
    motionController?: MotionController;
  };

export type DatePickerSingleProps = DatePickerSharedProps & {
  selectionMode?: "single";
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (value: Date | null) => void;
  values?: never;
  defaultValues?: never;
  onValuesChange?: never;
};

export type DatePickerRangeProps = DatePickerSharedProps & {
  selectionMode: "range";
  value?: CalendarRangeValue;
  defaultValue?: CalendarRangeValue;
  onValueChange?: (value: CalendarRangeValue) => void;
  values?: never;
  defaultValues?: never;
  onValuesChange?: never;
};

export type DatePickerMultipleProps = DatePickerSharedProps & {
  selectionMode: "multiple";
  value?: never;
  defaultValue?: never;
  onValueChange?: never;
  values?: Date[];
  defaultValues?: Date[];
  onValuesChange?: (values: Date[]) => void;
};

export type DatePickerProps = DatePickerSingleProps | DatePickerRangeProps | DatePickerMultipleProps;

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
  /**
   * Menu panel motion. Wins over `motion.popover` on the root.
   * Forwarded to the inner Popover `content` slot.
   */
  motion?: Prettify<DatePickerPartMotion>;
};

export type DatePickerHintProps = HTMLAttributes<HTMLElement> & {
  children?: ReactNode;
  motion?: Prettify<DatePickerPartMotion>;
};

export type DatePickerErrorProps = HTMLAttributes<HTMLElement> & {
  children?: ReactNode;
  motion?: Prettify<DatePickerPartMotion>;
};

export type DatePickerStoredValue = Date | null | CalendarRangeValue | Date[];

export type DatePickerContextValue = {
  mode: DatePickerMode;
  value: DatePickerStoredValue;
  commit: (next: DatePickerStoredValue) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  disabled: boolean;
  readOnly: boolean;
  placeholder: string;
  display: string;
  empty: boolean;
  size: InputSize;
  icon?: ReactNode | null;
  variant: InputVariant;
  locale: CalendarLocale;
  minDate?: Date;
  maxDate?: Date;
  isDateUnavailable?: (date: Date) => boolean;
  defaultMonth?: Date;
  month?: Date;
  onMonthChange?: (month: Date) => void;
  view?: CalendarView;
  defaultView?: CalendarView;
  onViewChange?: (view: CalendarView) => void;
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
