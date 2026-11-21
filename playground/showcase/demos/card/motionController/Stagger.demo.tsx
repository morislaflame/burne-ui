import { Button } from "@/components/core/Button";
import { Card } from "@/components/core/Card";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "card:rise": { y: -6, duration: 0.22, ease: "power2.out", replay: "rest" },
  "card:rest": { y: 0, duration: 0.16, ease: "power2.out" },
});

export function CardMotionControllerStaggerDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button
          size="small"
          variant="outline"
          onClick={() => void controller.playAll("card:rise", { stagger: 0.08 })}
        >
          Stagger
        </Button>
        <Button size="small" variant="ghost" onClick={() => void controller.playAll("card:rest")}>
          Rest
        </Button>
      </div>
      <Card motionController={controller} motion={{ events }} className="max-w-xs">
        <Card.Header>
          <Card.Title>playAll + stagger</Card.Title>
          <Card.Description>Same event on every live slot, 80ms apart.</Card.Description>
        </Card.Header>
        <Card.Body>Body is a slot too.</Card.Body>
        <Card.Footer>Footer last.</Card.Footer>
      </Card>
    </div>
  );
}
