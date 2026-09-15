import { Button } from "@/components/core/Button";
import { TimeField } from "@/components/core/TimeField";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function TimeFieldMotionControllerPlayVsSlotDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("shell", "hoverIn")}>
          playSlot(shell)
        </Button>
        <Button size="small" variant="outline" onClick={() => controller.playSlot("prefix", "hoverIn")}>
          playSlot(prefix)
        </Button>
        <Button size="small" variant="outline" onClick={() => void controller.playAll("hoverIn")}>
          playAll()
        </Button>
        <Button size="small" variant="ghost" onClick={() => void controller.playAll("hoverOut")}>
          Reset
        </Button>
      </div>
      <TimeField
        label="Start"
        defaultValue="09:30"
        prefix="@"
        motionController={controller}
        motion={{
          shell: {
            hoverIn: { y: -4, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
          prefix: {
            hoverIn: { y: -6, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
        }}
      />
    </div>
  );
}
