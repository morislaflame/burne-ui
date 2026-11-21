import { DatePicker } from "@/components/core/DatePicker";

export function DatePickerMotionCompoundDemo() {
  return (
    <DatePicker classNames={{ trigger: "bg-primary-tint" }}>
      <DatePicker.Label
        motion={{
          enter: (ctx) => ctx.fromTo({ y: 6, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3 }),
        }}
      >
        Departure
      </DatePicker.Label>
      <DatePicker.Trigger
        motion={{
          hoverIn: { y: -4, duration: 0.24 },
          hoverOut: { y: 0, duration: 0.2 },
        }}
      />
      <DatePicker.Popover />
      <DatePicker.Hint
        motion={{
          enter: (ctx) => ctx.fromTo({ opacity: 0 }, { opacity: 1, duration: 0.35, delay: 0.08 }),
        }}
      >
        Single day
      </DatePicker.Hint>
    </DatePicker>
  );
}
