import { Button } from "@/components/core/Button";
import { ToggleButton } from "@/components/core/ToggleButton";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";
import { IoHeartOutline } from "react-icons/io5";

const events = createMotionEvents({
  "like:nudge": { y: -8, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

export function ToggleButtonMotionEventsPingDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.play("like:nudge")}>
        Nudge
      </Button>
      <ToggleButton
        variant="outline"
        icon={<IoHeartOutline aria-hidden />}
        motionController={controller}
        motion={{ events, root: { pressIn: false } }}
      >
        Like
      </ToggleButton>
    </div>
  );
}
