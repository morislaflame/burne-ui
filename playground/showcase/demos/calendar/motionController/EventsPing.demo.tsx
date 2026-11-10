import { Calendar } from "@/components/core/Calendar";
import { Button } from "@/components/core/Button";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "calendar:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

export function CalendarMotionEventsPingDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.playSlot("header", "calendar:nudge")}>
        Nudge
      </Button>
      <Calendar
        defaultMonth={new Date(2026, 7, 1)}
        motionController={controller}
        motion={{
          navPrev: { hoverIn: false, hoverOut: false, pressIn: false, pressOut: false },
          navNext: { hoverIn: false, hoverOut: false, pressIn: false, pressOut: false },
          cell: { hoverIn: false, hoverOut: false, pressIn: false, pressOut: false },
          events,
        }}
      >
        <Calendar.Header />
        <Calendar.Grid />
        <Calendar.Footer />
      </Calendar>
    </div>
  );
}
