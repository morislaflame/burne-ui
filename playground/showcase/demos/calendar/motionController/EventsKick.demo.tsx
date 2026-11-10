import { Calendar } from "@/components/core/Calendar";
import { Button } from "@/components/core/Button";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "calendar:scan": (ctx) => {
    const tl = ctx.timeline();
    tl.fromRest(ctx.el, { y: -4, duration: 0.16, ease: "power2.out" }, 0);
    if (ctx.targets.grid) {
      tl.fromRest(ctx.targets.grid, { y: -8, duration: 0.18 }, 0);
    }
    if (ctx.targets.footer) {
      tl.fromRest(ctx.targets.footer, { y: -10, duration: 0.18 }, 0.04);
    }
    tl.to(ctx.el, { y: 0, duration: 0.24, ease: "power2.inOut" }, 0.22);
    if (ctx.targets.grid) {
      tl.to(ctx.targets.grid, { y: 0, duration: 0.22 }, 0.22);
    }
    if (ctx.targets.footer) {
      tl.to(ctx.targets.footer, { y: 0, duration: 0.22 }, 0.22);
    }
    return tl;
  },
});

export function CalendarMotionEventsKickDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.playSlot("header", "calendar:scan")}>
        Scan
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
