import { ToggleButtonGroup } from "@/components/composite/ToggleButtonGroup";
import { Button } from "@/components/core/Button";
import { ToggleButton } from "@/components/core/ToggleButton";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "group:nudge": { y: -8, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

export function ToggleButtonGroupMotionEventsPingDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.play("group:nudge")}>
        Nudge
      </Button>
      <ToggleButtonGroup
        type="single"
        defaultValue="list"
        aria-label="View"
        motionController={controller}
        motion={{ events }}
      >
        <ToggleButton value="list">List</ToggleButton>
        <ToggleButton value="grid">Grid</ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
}
