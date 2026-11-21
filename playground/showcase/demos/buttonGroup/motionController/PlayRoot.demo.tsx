import { ButtonGroup } from "@/components/composite/ButtonGroup";
import { Button } from "@/components/core/Button";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function ButtonGroupMotionControllerDemo() {
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
        <Button size="small" variant="ghost" onClick={() => controller.set("root", { y: 0 })}>
          Snap
        </Button>
      </div>
      <ButtonGroup
        aria-label="Edit"
        motionController={controller}
        motion={{
          root: {
            hoverIn: { y: -6, duration: 0.28, replay: "rest" },
            hoverOut: { y: 0, duration: 0.2 },
          },
        }}
      >
        <ButtonGroup.Text>Edit</ButtonGroup.Text>
        <Button>Cut</Button>
        <Button>Copy</Button>
      </ButtonGroup>
    </div>
  );
}
