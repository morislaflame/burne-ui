import { Button } from "@/components/core/Button";
import { PinInput } from "@/components/core/PinInput";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function PinInputMotionPlayFieldDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("field", "hoverIn")}>
          Lift
        </Button>
        <Button size="small" variant="outline" onClick={() => controller.playSlot("field", "hoverOut")}>
          Rest
        </Button>
        <Button size="small" variant="ghost" onClick={() => controller.set("field", { y: 0 })}>
          Snap
        </Button>
      </div>
      <PinInput
        label="Code"
        length={4}
        motionController={controller}
        motion={{
          field: {
            hoverIn: { y: -6, duration: 0.28, replay: "rest" },
            hoverOut: { y: 0, duration: 0.2 },
          },
        }}
      />
    </div>
  );
}
