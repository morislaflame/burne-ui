import { Button } from "@/components/core/Button";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function ButtonMotionControllerDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("root", "hoverIn")}>
          Pulse
        </Button>
        <Button size="small" variant="outline" onClick={() => controller.playSlot("root", "hoverOut")}>
          Reset
        </Button>
        <Button size="small" variant="ghost" onClick={() => controller.set("root", { y: 0, scale: 1 })}>
          Snap
        </Button>
      </div>
      <Button
        variant="outline"
        motionController={controller}
        motion={{
          root: {
            hoverIn: { y: -6, scale: 1.04, duration: 0.28, replay: "rest" },
            hoverOut: { y: 0, scale: 1, duration: 0.2 },
            pressIn: false,
          },
        }}
      >
        Target
      </Button>
    </div>
  );
}
