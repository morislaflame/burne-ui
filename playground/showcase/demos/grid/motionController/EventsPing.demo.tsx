import { Button } from "@/components/core/Button";
import { Grid } from "@/components/core/Grid";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "grid:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

export function GridMotionEventsPingDemo() {
  const controller = useMotionControllerHandle();
  return (
    <div className="flex w-full flex-col gap-mid">
      <Button size="small" variant="outline" onClick={() => controller.play("grid:nudge")}>Nudge</Button>
      <Grid columns={3} gap="mid" motionController={controller} motion={{ events }}>
        <span>Nudge</span>
      </Grid>
    </div>
  );
}
