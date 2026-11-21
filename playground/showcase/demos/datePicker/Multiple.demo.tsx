import { DatePicker } from "@/components/core/DatePicker";

export function DatePickerMultipleDemo() {
  return (
    <DatePicker
      selectionMode="multiple"
      label="Days"
      hint="The calendar stays open after each day."
    />
  );
}
