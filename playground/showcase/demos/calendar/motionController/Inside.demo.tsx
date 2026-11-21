import { Calendar } from "@/components/core/Calendar";
import { createMotionEvents, useMotionController } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "calendar:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

function FooterPulse() {
  const controller = useMotionController();
  return (
    <Calendar.Footer onPointerEnter={() => controller.playSlot("footer", "calendar:nudge")} />
  );
}

export function CalendarMotionControllerInsideDemo() {
  return (
    <Calendar
      defaultMonth={new Date(2026, 7, 1)}
      motion={{
        navPrev: { hoverIn: false, hoverOut: false, pressIn: false, pressOut: false },
        navNext: { hoverIn: false, hoverOut: false, pressIn: false, pressOut: false },
        cell: { hoverIn: false, hoverOut: false, pressIn: false, pressOut: false },
        events,
      }}
    >
      <Calendar.Header />
      <Calendar.Grid />
      <FooterPulse />
    </Calendar>
  );
}
