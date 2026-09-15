import { Button } from "@/components/core/Button";
import { Input } from "@/components/core/Input";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function InputMotionControllerPlayVsSlotDemo() {
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
      <Input
        label="Handle"
        prefix="@"
        placeholder="name"
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
