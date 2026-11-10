import { Button } from "@/components/core/Button";
import { Stack } from "@/components/core/Stack";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "stack:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

export function StackMotionEventsPingDemo() {
  const controller = useMotionControllerHandle();
  return (
    <div className="flex w-full flex-col gap-mid">
      <Button size="small" variant="outline" onClick={() => controller.play("stack:nudge")}>Nudge</Button>
      <Stack orientation="horizontal" gap="mid" motionController={controller} motion={{ events }}>
        <span>Nudge</span>
      </Stack>
    </div>
  );
}
