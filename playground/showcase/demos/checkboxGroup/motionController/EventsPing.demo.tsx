import { CheckboxGroup } from "@/components/composite/CheckboxGroup";
import { Button } from "@/components/core/Button";
import { Checkbox } from "@/components/core/Checkbox";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";
import { Label } from "@/components/core/Label";

const events = createMotionEvents({
  "checks:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

export function CheckboxGroupMotionEventsPingDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.play("checks:nudge")}>
        Nudge
      </Button>
      <CheckboxGroup motionController={controller} motion={{ events }}>
        <CheckboxGroup.Legend>
          <Label>Plan</Label>
          <CheckboxGroup.Hint>Root yoyo on the group scope.</CheckboxGroup.Hint>
        </CheckboxGroup.Legend>
        <CheckboxGroup.List>
          <Checkbox value="pro" label="Pro" />
          <Checkbox value="team" label="Team" />
        </CheckboxGroup.List>
      </CheckboxGroup>
    </div>
  );
}
