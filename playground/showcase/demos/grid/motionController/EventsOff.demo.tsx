import { Button } from "@/components/core/Button";
import { Grid } from "@/components/core/Grid";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const live = createMotionEvents({
  "grid:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});
const off = createMotionEvents({ "grid:nudge": false });

export function GridMotionEventsOffDemo() {
  const liveController = useMotionControllerHandle();
  const offController = useMotionControllerHandle();
  return (
    <div className="flex w-full flex-col gap-mid">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => liveController.play("grid:nudge")}>Live</Button>
        <Button size="small" variant="ghost" onClick={() => offController.play("grid:nudge")}>Off</Button>
      </div>
      <Grid columns={3} gap="mid" motionController={liveController} motion={{ events: live }}><span>Live</span></Grid>
      <Grid columns={3} gap="mid" motionController={offController} motion={{ events: off }}><span>Off</span></Grid>
    </div>
  );
}
