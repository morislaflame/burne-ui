import { ButtonGroup } from "@/components/composite/ButtonGroup";
import { Button } from "@/components/core/Button";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "toolbar:nudge": { y: -8, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

export function ButtonGroupMotionEventsPingDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.play("toolbar:nudge")}>
        Nudge
      </Button>
      <ButtonGroup aria-label="Edit" motionController={controller} motion={{ events }}>
        <ButtonGroup.Text>Edit</ButtonGroup.Text>
        <Button>Cut</Button>
        <Button>Copy</Button>
      </ButtonGroup>
    </div>
  );
}
