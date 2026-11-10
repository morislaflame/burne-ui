import { Calendar } from "@/components/core/Calendar";
import { Button } from "@/components/core/Button";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const live = createMotionEvents({
  "calendar:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});
const off = createMotionEvents({ "calendar:nudge": false });

export function CalendarMotionEventsOffDemo() {
  const liveController = useMotionControllerHandle();
  const offController = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => liveController.playSlot("header", "calendar:nudge")}>
          Live nudge
        </Button>
        <Button size="small" variant="ghost" onClick={() => offController.playSlot("header", "calendar:nudge")}>
          Off nudge
        </Button>
      </div>
      <Calendar
        defaultMonth={new Date(2026, 7, 1)}
        motionController={liveController}
        motion={{
          navPrev: { hoverIn: false, hoverOut: false, pressIn: false, pressOut: false },
          navNext: { hoverIn: false, hoverOut: false, pressIn: false, pressOut: false },
          cell: { hoverIn: false, hoverOut: false, pressIn: false, pressOut: false },
          events: live,
        }}
      >
        <Calendar.Header />
        <Calendar.Grid />
      </Calendar>
      <Calendar
        defaultMonth={new Date(2026, 7, 1)}
        motionController={offController}
        motion={{
          navPrev: { hoverIn: false, hoverOut: false, pressIn: false, pressOut: false },
          navNext: { hoverIn: false, hoverOut: false, pressIn: false, pressOut: false },
          cell: { hoverIn: false, hoverOut: false, pressIn: false, pressOut: false },
          events: off,
        }}
      >
        <Calendar.Header />
        <Calendar.Grid />
      </Calendar>
    </div>
  );
}
