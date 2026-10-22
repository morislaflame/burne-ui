import { Card } from "@/components/core/Card";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "card:select": { scale: 1.03, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.out" },
});

export function CardMotionEventsPressableDemo() {
  const controller = useMotionControllerHandle();

  return (
    <Card
      pressable
      className="max-w-xs"
      motionController={controller}
      motion={{ events }}
      onClick={() => controller.play("card:select")}
    >
      <Card.Header>
        <Card.Title>Pressable + events</Card.Title>
        <Card.Description>
          Hover lift stays on the root. onClick plays card:select — not hoverIn.
        </Card.Description>
      </Card.Header>
    </Card>
  );
}
