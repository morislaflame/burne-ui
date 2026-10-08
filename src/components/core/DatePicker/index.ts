import { DatePickerRoot } from "./DatePicker";
import {
  DatePickerError,
  DatePickerHint,
  DatePickerLabel,
  DatePickerPopover,
  DatePickerTrigger,
} from "./datePickerParts";

export const DatePicker = Object.assign(DatePickerRoot, {
  Label: DatePickerLabel,
  Trigger: DatePickerTrigger,
  Popover: DatePickerPopover,
  Hint: DatePickerHint,
  Error: DatePickerError,
});

export type {
  DatePickerClassNames,
  DatePickerErrorProps,
  DatePickerHintProps,
  DatePickerLabelProps,
  DatePickerMode,
  DatePickerMotion,
  DatePickerPartMotion,
  DatePickerPopoverProps,
  DatePickerProps,
  DatePickerRangeProps,
  DatePickerSingleProps,
  DatePickerTriggerProps,
} from "./datePickerTypes";
