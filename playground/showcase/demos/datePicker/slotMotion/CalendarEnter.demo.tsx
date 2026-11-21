import { DatePicker } from "@/components/core/DatePicker";

export function DatePickerMotionCalendarEnterDemo() {
  return (
    <DatePicker
      label="Date"
      defaultOpen
      motion={{
        calendar: {
          enter: (ctx) =>
            ctx.fromTo({ scale: 0.92, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4 }),
        },
      }}
    />
  );
}
