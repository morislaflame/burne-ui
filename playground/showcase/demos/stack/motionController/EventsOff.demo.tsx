import { Button } from "@/components/core/Button";
import { Stack } from "@/components/core/Stack";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const live = createMotionEvents({
  "stack:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});
const off = createMotionEvents({ "stack:nudge": false });

export function StackMotionEventsOffDemo() {
  const liveController = useMotionControllerHandle();
  const offController = useMotionControllerHandle();
  return (
    <div className="flex w-full flex-col gap-mid">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => liveController.play("stack:nudge")}>Live</Button>
        <Button size="small" variant="ghost" onClick={() => offController.play("stack:nudge")}>Off</Button>
      </div>
      <Stack orientation="horizontal" gap="mid" motionController={liveController} motion={{ events: live }}><span>Live</span></Stack>
      <Stack orientation="horizontal" gap="mid" motionController={offController} motion={{ events: off }}><span>Off</span></Stack>
    </div>
  );
}
