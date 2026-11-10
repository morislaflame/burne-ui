import { DatePicker } from "@/components/core/DatePicker";

const OCTOBER_15 = new Date(2026, 9, 15);

export function DatePickerLocaleDemo() {
  return (
    <div className="flex flex-wrap items-start gap-2xlarge">
      <DatePicker label="Date" locale="en-GB" defaultValue={OCTOBER_15} />
      <DatePicker label="Дата" locale="ru" defaultValue={OCTOBER_15} />
    </div>
  );
}
