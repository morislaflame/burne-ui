import { DatePicker } from "@/components/core/DatePicker";

export function DatePickerMotionHoverOffDemo() {
  return (
    <DatePicker
      label="Date"
      motion={{
        trigger: { hoverIn: false, hoverOut: false },
      }}
    />
  );
}
