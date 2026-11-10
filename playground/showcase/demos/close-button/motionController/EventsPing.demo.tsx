import { Button } from "@/components/core/Button";
import { CloseButton } from "@/components/core/CloseButton";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "dismiss:nudge": { y: -8, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

export function CloseButtonMotionEventsPingDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.play("dismiss:nudge")}>
        Nudge
      </Button>
      <CloseButton
        aria-label="dismiss nudge close"
        motionController={controller}
        motion={{ events, root: { pressIn: false } }}
      />
    </div>
  );
}
