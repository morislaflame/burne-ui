import { Button } from "@/components/core/Button";
import { CloseButton } from "@/components/core/CloseButton";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function CloseButtonMotionControllerDemo() {
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
      <CloseButton
        aria-label="Target close"
        motionController={controller}
        motion={{
          root: {
            hoverIn: { y: -6, scale: 1.08, duration: 0.28, replay: "rest" },
            hoverOut: { y: 0, scale: 1, duration: 0.2 },
            pressIn: false,
          },
        }}
      />
    </div>
  );
}
