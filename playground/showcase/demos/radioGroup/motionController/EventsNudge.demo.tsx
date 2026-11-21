import { RadioGroup } from "@/components/composite/RadioGroup";
import { Button } from "@/components/core/Button";
import { Radio } from "@/components/core/Radio";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";
import { Label } from "@/components/core/Label";

const events = createMotionEvents({
  "choice:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

export function RadioGroupMotionEventsNudgeDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.play("choice:nudge")}>
        Nudge
      </Button>
      <RadioGroup aria-label="Shipping" motionController={controller} motion={{ events }}>
        <RadioGroup.Legend>
          <Label>Shipping</Label>
          <RadioGroup.Hint>Root yoyo on the group scope.</RadioGroup.Hint>
        </RadioGroup.Legend>
        <RadioGroup.List>
          <Radio value="ground" label="Ground" />
          <Radio value="air" label="Air" />
        </RadioGroup.List>
      </RadioGroup>
    </div>
  );
}
