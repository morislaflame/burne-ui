import { Calendar, useCalendar } from "@/components/core/Calendar";
import { Button } from "@/components/core/Button";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

function PinnedDay({ controller }: { controller: ReturnType<typeof useMotionControllerHandle> }) {
  const { today, onDayPress, size } = useCalendar();
  return (
    <Calendar.Day
      selected
      isToday
      size={size}
      onPress={() => onDayPress(today)}
      motionController={controller}
      motion={{
        hoverIn: { y: -6, duration: 0.22, replay: "rest" },
        hoverOut: { y: 0, duration: 0.16 },
      }}
    >
      {today.getDate()}
    </Calendar.Day>
  );
}

export function CalendarMotionControllerPlayCellDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("cell", "hoverIn")}>
          playSlot(cell)
        </Button>
        <Button size="small" variant="outline" onClick={() => controller.playSlot("cell", "hoverOut")}>
          Reset
        </Button>
        <Button size="small" variant="ghost" onClick={() => controller.set("cell", { y: 0 })}>
          Snap
        </Button>
      </div>
      <Calendar defaultMonth={new Date(2026, 7, 1)}>
        <Calendar.Header />
        <PinnedDay controller={controller} />
      </Calendar>
    </div>
  );
}
