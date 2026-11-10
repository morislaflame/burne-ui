import { DatePicker } from "@/components/core/DatePicker";

export function DatePickerSizesDemo() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-small">
      <DatePicker size="small" label="Small" />
      <DatePicker size="base" label="Base" />
      <DatePicker size="mid" label="Mid" />
      <DatePicker size="large" label="Large" />
    </div>
  );
}
