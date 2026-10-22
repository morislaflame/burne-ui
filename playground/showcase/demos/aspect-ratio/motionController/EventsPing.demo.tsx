import { Button } from "@/components/core/Button";
import { AspectRatio } from "@/components/core/AspectRatio";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "frame:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

export function AspectRatioMotionEventsPingDemo() {
  const controller = useMotionControllerHandle();
  return (
    <div className="flex w-full flex-col gap-mid">
      <Button size="small" variant="outline" onClick={() => controller.play("frame:nudge")}>Nudge</Button>
      <AspectRatio ratio="16/9" motionController={controller} motion={{ events }}><span>16/9</span></AspectRatio>
    </div>
  );
}
