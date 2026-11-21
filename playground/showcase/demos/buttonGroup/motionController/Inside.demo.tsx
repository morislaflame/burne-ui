import { ButtonGroup } from "@/components/composite/ButtonGroup";
import { Button } from "@/components/core/Button";
import { createMotionEvents, useMotionController } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "toolbar:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

function Caption() {
  const controller = useMotionController();
  return (
    <ButtonGroup.Text onPointerEnter={() => controller.play("toolbar:nudge")}>
      Edit
    </ButtonGroup.Text>
  );
}

export function ButtonGroupMotionControllerInsideDemo() {
  return (
    <ButtonGroup aria-label="Edit" motion={{ events }}>
      <Caption />
      <Button>Cut</Button>
      <Button>Copy</Button>
    </ButtonGroup>
  );
}
