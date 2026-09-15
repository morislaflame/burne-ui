import { Button } from "@/components/core/Button";
import { Card } from "@/components/core/Card";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "card:highlight": {
    y: -3,
    scale: 1.04,
    duration: 0.22,
    ease: "back.out(2)",
    replay: "rest",
  },
  "card:rest": { y: 0, scale: 1, duration: 0.18, ease: "power2.out" },
});

export function CardMotionControllerHighlightDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("title", "card:highlight")}>
          Title
        </Button>
        <Button size="small" variant="outline" onClick={() => controller.playSlot("body", "card:highlight")}>
          Body
        </Button>
        <Button size="small" variant="ghost" onClick={() => controller.playAll("card:rest")}>
          Rest
        </Button>
      </div>
      <Card motionController={controller} motion={{ events }} className="max-w-xs">
        <Card.Header>
          <Card.Title>playSlot</Card.Title>
          <Card.Description>Same event, different targets.</Card.Description>
        </Card.Header>
        <Card.Body>The body slot can play the highlight too.</Card.Body>
      </Card>
    </div>
  );
}
