import { Button } from "@/components/core/Button";
import { NumberInput } from "@/components/core/NumberInput";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function NumberInputMotionPlayShellDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("shell", "hoverIn")}>
          Lift
        </Button>
        <Button size="small" variant="outline" onClick={() => controller.playSlot("shell", "hoverOut")}>
          Rest
        </Button>
        <Button size="small" variant="ghost" onClick={() => controller.set("shell", { y: 0 })}>
          Snap
        </Button>
      </div>
      <NumberInput
        label="Quantity"
        defaultValue={1}
        motionController={controller}
        motion={{
          shell: {
            hoverIn: { y: -6, duration: 0.28, replay: "rest" },
            hoverOut: { y: 0, duration: 0.2 },
          },
        }}
      />
    </div>
  );
}
