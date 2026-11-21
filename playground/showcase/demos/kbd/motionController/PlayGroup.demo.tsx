import { Button } from "@/components/core/Button";
import { Kbd } from "@/components/core/Kbd";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function KbdMotionControllerPlayGroupDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("group", "hoverIn")}>
          playSlot(group)
        </Button>
        <Button size="small" variant="outline" onClick={() => controller.playSlot("group", "hoverOut")}>
          Reset
        </Button>
        <Button size="small" variant="ghost" onClick={() => controller.set("group", { y: 0 })}>
          Snap
        </Button>
      </div>
      <Kbd.Group
        motionController={controller}
        motion={{
          hoverIn: { y: -6, duration: 0.22, replay: "rest" },
          hoverOut: { y: 0, duration: 0.16 },
        }}
      >
        <Kbd hoverLift={false}>⌘</Kbd>
        <Kbd hoverLift={false}>K</Kbd>
      </Kbd.Group>
    </div>
  );
}
