import { DatePicker } from "@/components/core/DatePicker";

export function DatePickerClassNamesDemo() {
  return (
    <DatePicker
      label="Date"
      classNames={{
        trigger: "bg-primary-tint",
        value: "font-w-mid",
      }}
    />
  );
}
