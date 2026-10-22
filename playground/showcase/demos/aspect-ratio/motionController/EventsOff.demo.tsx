import { Button } from "@/components/core/Button";
import { AspectRatio } from "@/components/core/AspectRatio";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const live = createMotionEvents({
  "frame:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});
const off = createMotionEvents({ "frame:nudge": false });

export function AspectRatioMotionEventsOffDemo() {
  const liveController = useMotionControllerHandle();
  const offController = useMotionControllerHandle();
  return (
    <div className="flex w-full flex-col gap-mid">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => liveController.play("frame:nudge")}>Live</Button>
        <Button size="small" variant="ghost" onClick={() => offController.play("frame:nudge")}>Off</Button>
      </div>
      <AspectRatio ratio="16/9" motionController={liveController} motion={{ events: live }}><span>16/9</span></AspectRatio>
      <AspectRatio ratio="16/9" motionController={offController} motion={{ events: off }}><span>16/9</span></AspectRatio>
    </div>
  );
}
