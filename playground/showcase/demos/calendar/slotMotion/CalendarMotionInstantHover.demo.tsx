import { Calendar } from "@/components/core/Calendar";

export function CalendarMotionInstantHoverDemo() {
  return (
    <Calendar
      motion={{
        navPrev: { hoverIn: false, hoverOut: false },
        navNext: { hoverIn: false, hoverOut: false },
        cell: { hoverIn: false, hoverOut: false },
      }}
    />
  );
}
