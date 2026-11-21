import { DatePicker } from "@/components/core/DatePicker";

export function DatePickerMotionTriggerLiftDemo() {
  return (
    <DatePicker
      label="Date"
      motion={{
        trigger: {
          hoverIn: { y: -6, duration: 0.28 },
          hoverOut: { y: 0, duration: 0.22 },
        },
      }}
    />
  );
}
