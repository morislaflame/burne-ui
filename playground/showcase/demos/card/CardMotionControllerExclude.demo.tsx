import { Button } from "@/components/core/Button";
import { Card } from "@/components/core/Card";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "card:rise": { y: -6, duration: 0.22, ease: "power2.out", replay: "rest" },
  "card:rest": { y: 0, duration: 0.16, ease: "power2.out" },
});

export function CardMotionControllerExcludeDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex w-full flex-col gap-large">
      <div className="flex flex-wrap gap-small">
        <Button
          size="small"
          variant="outline"
          onClick={() => void controller.playAll("card:rise", { exclude: ["footer"] })}
        >
          Skip footer
        </Button>
        <Button size="small" variant="ghost" onClick={() => void controller.playAll("card:rest")}>
          Rest
        </Button>
      </div>
      <Card motionController={controller} motion={{ events }} className="max-w-xs">
        <Card.Header>
          <Card.Title>exclude footer</Card.Title>
          <Card.Description>Header and body rise; footer stays.</Card.Description>
        </Card.Header>
        <Card.Body>Body moves.</Card.Body>
        <Card.Footer>
          <Button size="small" variant="ghost">
            Stays
          </Button>
        </Card.Footer>
      </Card>
    </div>
  );
}
