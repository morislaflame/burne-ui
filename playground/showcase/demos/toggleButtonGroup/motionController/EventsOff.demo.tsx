import { ToggleButtonGroup } from "@/components/composite/ToggleButtonGroup";
import { Button } from "@/components/core/Button";
import { ToggleButton } from "@/components/core/ToggleButton";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const live = createMotionEvents({
  "group:nudge": { y: -8, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});
const off = createMotionEvents({ "group:nudge": false });

export function ToggleButtonGroupMotionEventsOffDemo() {
  const liveController = useMotionControllerHandle();
  const offController = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => liveController.play("group:nudge")}>
          Live nudge
        </Button>
        <Button size="small" variant="ghost" onClick={() => offController.play("group:nudge")}>
          Off nudge
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-large">
        <ToggleButtonGroup
          type="single"
          defaultValue="list"
          aria-label="Live view"
          motionController={liveController}
          motion={{ events: live }}
        >
          <ToggleButton value="list">Live</ToggleButton>
          <ToggleButton value="grid">Grid</ToggleButton>
        </ToggleButtonGroup>
        <ToggleButtonGroup
          type="single"
          defaultValue="list"
          aria-label="Off view"
          variant="outline"
          motionController={offController}
          motion={{ events: off }}
        >
          <ToggleButton value="list">Off</ToggleButton>
          <ToggleButton value="grid">Grid</ToggleButton>
        </ToggleButtonGroup>
      </div>
    </div>
  );
}
