import { DatePicker } from "@/components/core/DatePicker";

export function DatePickerMotionChromeDemo() {
  return (
    <DatePicker
      label="Date"
      hint="One day"
      error="Pick a day"
      motion={{
        label: {
          enter: (ctx) => ctx.fromTo({ y: 6, opacity: 0 }, { y: 0, opacity: 1, duration: 0.28 }),
        },
        hint: {
          enter: (ctx) =>
            ctx.fromTo({ y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.28, delay: 0.06 }),
        },
        error: {
          enter: (ctx) =>
            ctx.fromTo({ y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.28, delay: 0.12 }),
        },
      }}
    />
  );
}
