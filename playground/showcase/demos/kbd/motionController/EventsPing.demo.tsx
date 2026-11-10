import { Button } from "@/components/core/Button";
import { Kbd } from "@/components/core/Kbd";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "kbd:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

export function KbdMotionEventsPingDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.play("kbd:nudge")}>
        Nudge
      </Button>
      <Kbd hoverLift={false} motionController={controller} motion={{ events }}>
        ⌘
      </Kbd>
    </div>
  );
}
