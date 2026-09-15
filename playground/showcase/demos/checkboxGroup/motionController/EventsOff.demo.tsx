import { CheckboxGroup } from "@/components/composite/CheckboxGroup";
import { Button } from "@/components/core/Button";
import { Checkbox } from "@/components/core/Checkbox";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const live = createMotionEvents({
  "checks:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});
const off = createMotionEvents({ "checks:nudge": false });

export function CheckboxGroupMotionEventsOffDemo() {
  const liveController = useMotionControllerHandle();
  const offController = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => liveController.play("checks:nudge")}>
          Live nudge
        </Button>
        <Button size="small" variant="ghost" onClick={() => offController.play("checks:nudge")}>
          Off nudge
        </Button>
      </div>
      <CheckboxGroup motionController={liveController} motion={{ events: live }}>
        <CheckboxGroup.Legend>
          <CheckboxGroup.Label>Live</CheckboxGroup.Label>
          <CheckboxGroup.Hint>Events play.</CheckboxGroup.Hint>
        </CheckboxGroup.Legend>
        <CheckboxGroup.List>
          <Checkbox value="pro" label="Pro" />
        </CheckboxGroup.List>
      </CheckboxGroup>
      <CheckboxGroup motionController={offController} motion={{ events: off }}>
        <CheckboxGroup.Legend>
          <CheckboxGroup.Label>Off</CheckboxGroup.Label>
          <CheckboxGroup.Hint>events: false skips.</CheckboxGroup.Hint>
        </CheckboxGroup.Legend>
        <CheckboxGroup.List>
          <Checkbox value="team" label="Team" />
        </CheckboxGroup.List>
      </CheckboxGroup>
    </div>
  );
}
