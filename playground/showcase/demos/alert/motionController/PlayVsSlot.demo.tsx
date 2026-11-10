import { Alert } from "@/components/core/Alert";
import { Button } from "@/components/core/Button";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function AlertMotionControllerPlayVsSlotDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.play("hoverIn")}>
          play()
        </Button>
        <Button size="small" variant="outline" onClick={() => controller.playSlot("title", "hoverIn")}>
          playSlot(title)
        </Button>
        <Button size="small" variant="outline" onClick={() => void controller.playAll("hoverIn")}>
          playAll()
        </Button>
        <Button size="small" variant="ghost" onClick={() => void controller.playAll("hoverOut")}>
          Reset
        </Button>
      </div>
      <Alert
        status="info"
        title="play vs playSlot vs playAll"
        description="play() hits root. playSlot names a child. playAll walks every live node."
        hoverLift={false}
        motionController={controller}
        motion={{
          root: { hoverIn: { y: -4, duration: 0.22, replay: "rest" }, hoverOut: { y: 0, duration: 0.16 } },
          indicator: { hoverIn: { y: -8, duration: 0.22, replay: "rest" }, hoverOut: { y: 0, duration: 0.16 } },
          title: { hoverIn: { y: -6, duration: 0.22, replay: "rest" }, hoverOut: { y: 0, duration: 0.16 } },
          description: { hoverIn: { y: -3, duration: 0.22, replay: "rest" }, hoverOut: { y: 0, duration: 0.16 } },
        }}
      />
    </div>
  );
}
