import { useState } from "react";

import { Calendar } from "@/components/core/Calendar";
import { Button } from "@/components/core/Button";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "calendar:out": { y: -8, duration: 0.28, ease: "power2.out", replay: "rest" },
  "calendar:rest": { y: 0, duration: 0.22, ease: "power2.inOut" },
});

export function CalendarMotionEventsFinishedDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);

  async function bounce() {
    setBusy(true);
    try {
      await controller.playSlot("header", "calendar:out", { waitForComplete: true }).finished;
      await controller.playSlot("header", "calendar:rest", { waitForComplete: true }).finished;
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" disabled={busy} onClick={() => void bounce()}>
        Bounce
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
