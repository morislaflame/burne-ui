import { Button } from "@/components/core/Button";
import { Text } from "@/components/core/Text";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const live = createMotionEvents({
  "text:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});
const off = createMotionEvents({ "text:nudge": false });

export function TextMotionEventsOffDemo() {
  const liveController = useMotionControllerHandle();
  const offController = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => liveController.play("text:nudge")}>
          Live nudge
        </Button>
        <Button size="small" variant="ghost" onClick={() => offController.play("text:nudge")}>
          Off nudge
        </Button>
      </div>
      <Text variant="large" motionController={liveController} motion={{ events: live }}>
        Live copy
      </Text>
      <Text variant="large" className="opacity-70" motionController={offController} motion={{ events: off }}>
        Events off
      </Text>
    </div>
  );
}
