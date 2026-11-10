import { DatePicker } from "@/components/core/DatePicker";

export function DatePickerCompoundDemo() {
  return (
    <DatePicker>
      <DatePicker.Label>Departure</DatePicker.Label>
      <DatePicker.Trigger />
      <DatePicker.Popover />
      <DatePicker.Hint>Single day</DatePicker.Hint>
    </DatePicker>
  );
}
