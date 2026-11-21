import { DatePicker } from "@/components/core/DatePicker";

export function DatePickerMotionMenuEnterDemo() {
  return (
    <DatePicker
      label="Date"
      defaultOpen
      motion={{
        popover: {
          enter: (ctx) =>
            ctx.fromTo({ y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }),
          leave: (ctx) => ctx.to({ y: 8, opacity: 0, duration: 0.2 }),
        },
      }}
    />
  );
}
