import { Alert } from "@/components/core/Alert";
import { Button } from "@/components/core/Button";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const live = createMotionEvents({
  "notify:ping": { y: -8, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});
const off = createMotionEvents({ "notify:ping": false });

export function AlertMotionEventsOffDemo() {
  const liveController = useMotionControllerHandle();
  const offController = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => liveController.play("notify:ping")}>
          Live ping
        </Button>
        <Button size="small" variant="ghost" onClick={() => offController.play("notify:ping")}>
          Off ping
        </Button>
      </div>
      <Alert
        status="info"
        title="events on"
        description="Map runs."
        hoverLift={false}
        motionController={liveController}
        motion={{ events: live }}
      />
      <Alert
        status="default"
        title="events: false"
        description="Same name, false — skip, no tween."
        hoverLift={false}
        motionController={offController}
        motion={{ events: off }}
      />
    </div>
  );
}
