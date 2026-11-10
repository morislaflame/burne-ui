import { Button } from "@/components/core/Button";
import { DatePicker } from "@/components/core/DatePicker";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function DatePickerMotionPlayTriggerDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("trigger", "hoverIn")}>
          Lift
        </Button>
        <Button size="small" variant="outline" onClick={() => controller.playSlot("trigger", "hoverOut")}>
          Rest
        </Button>
        <Button size="small" variant="ghost" onClick={() => controller.set("trigger", { y: 0 })}>
          Snap
        </Button>
      </div>
      <DatePicker
        label="Date"
        motionController={controller}
        motion={{
          trigger: {
            hoverIn: { y: -6, duration: 0.28, replay: "rest" },
            hoverOut: { y: 0, duration: 0.2 },
          },
        }}
      />
    </div>
  );
}
