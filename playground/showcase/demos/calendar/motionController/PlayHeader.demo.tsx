import { Calendar } from "@/components/core/Calendar";
import { Button } from "@/components/core/Button";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function CalendarMotionControllerDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("header", "hoverIn")}>
          playSlot(header)
        </Button>
        <Button size="small" variant="outline" onClick={() => controller.playSlot("header", "hoverOut")}>
          Reset
        </Button>
        <Button size="small" variant="ghost" onClick={() => controller.set("header", { y: 0 })}>
          Snap
        </Button>
      </div>
      <Calendar
        defaultMonth={new Date(2026, 7, 1)}
        motionController={controller}
        motion={{
          navPrev: { hoverIn: false, hoverOut: false, pressIn: false, pressOut: false },
          navNext: { hoverIn: false, hoverOut: false, pressIn: false, pressOut: false },
          cell: { hoverIn: false, hoverOut: false, pressIn: false, pressOut: false },
          header: {
            hoverIn: { y: -6, duration: 0.28, replay: "rest" },
            hoverOut: { y: 0, duration: 0.2 },
          },
        }}
      >
        <Calendar.Header />
        <Calendar.Grid />
        <Calendar.Footer />
      </Calendar>
    </div>
  );
}
