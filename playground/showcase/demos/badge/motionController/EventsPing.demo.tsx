import { Badge } from "@/components/core/Badge";
import { Button } from "@/components/core/Button";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "notify:ping": { y: -8, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

export function BadgeMotionEventsPingDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.play("notify:ping")}>
        Ping
      </Button>
      <Badge status="info" hoverLift={false} motionController={controller} motion={{ events }}>
        notify:ping
      </Badge>
    </div>
  );
}
