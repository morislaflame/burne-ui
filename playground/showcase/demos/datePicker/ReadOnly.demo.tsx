import { DatePicker } from "@/components/core/DatePicker";

export function DatePickerReadOnlyDemo() {
  return (
    <DatePicker
      readOnly
      label="Shipped"
      defaultValue={new Date(2026, 0, 15)}
      hint="readOnly keeps the calendar closed."
    />
  );
}
