import { DatePicker } from "@/components/core/DatePicker";

export function DatePickerMotionChevronDemo() {
  return (
    <DatePicker
      label="Date"
      motion={{
        icon: {
          enter: (ctx) => ctx.to({ rotation: 45, duration: 0.35 }),
          leave: (ctx) => ctx.to({ rotation: 0, duration: 0.2 }),
        },
      }}
    />
  );
}
