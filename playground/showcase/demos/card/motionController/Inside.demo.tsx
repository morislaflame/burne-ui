import { Button } from "@/components/core/Button";
import { Card } from "@/components/core/Card";
import { createMotionEvents, useMotionController } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "card:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

function NudgeAction() {
  const controller = useMotionController();
  return (
    <Button size="small" variant="outline" onClick={() => controller.play("card:nudge")}>
      Nudge
    </Button>
  );
}

export function CardMotionControllerInsideDemo() {
  return (
    <Card motion={{ events }} className="max-w-xs">
      <Card.Header>
        <Card.Title>Inside the tree</Card.Title>
        <Card.Description>Footer calls useMotionController() — no handle on the root.</Card.Description>
      </Card.Header>
      <Card.Footer>
        <NudgeAction />
      </Card.Footer>
    </Card>
  );
}
