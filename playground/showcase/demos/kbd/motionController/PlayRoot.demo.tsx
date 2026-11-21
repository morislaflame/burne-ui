import { Button } from "@/components/core/Button";
import { Kbd } from "@/components/core/Kbd";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function KbdMotionControllerDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.play("hoverIn")}>
          play()
        </Button>
        <Button size="small" variant="outline" onClick={() => controller.play("hoverOut")}>
          Reset
        </Button>
        <Button size="small" variant="ghost" onClick={() => controller.set("root", { y: 0 })}>
          Snap
        </Button>
      </div>
      <Kbd
        hoverLift={false}
        motionController={controller}
        motion={{
          root: {
            hoverIn: { y: -4, duration: 0.28, replay: "rest" },
            hoverOut: { y: 0, duration: 0.2 },
          },
        }}
      >
        ⌘
      </Kbd>
    </div>
  );
}
