import { RadioGroup } from "@/components/composite/RadioGroup";
import { Button } from "@/components/core/Button";
import { Radio } from "@/components/core/Radio";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";
import { Label } from "@/components/core/Label";

const live = createMotionEvents({
  "choice:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});
const off = createMotionEvents({ "choice:nudge": false });

export function RadioGroupMotionEventsOffDemo() {
  const liveController = useMotionControllerHandle();
  const offController = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => liveController.play("choice:nudge")}>
          Live nudge
        </Button>
        <Button size="small" variant="ghost" onClick={() => offController.play("choice:nudge")}>
          Off nudge
        </Button>
      </div>
      <RadioGroup aria-label="Live shipping" motionController={liveController} motion={{ events: live }}>
        <RadioGroup.Legend>
          <Label>Live</Label>
          <RadioGroup.Hint>Events play.</RadioGroup.Hint>
        </RadioGroup.Legend>
        <RadioGroup.List>
          <Radio value="ground" label="Ground" />
        </RadioGroup.List>
      </RadioGroup>
      <RadioGroup aria-label="Off shipping" motionController={offController} motion={{ events: off }}>
        <RadioGroup.Legend>
          <Label>Off</Label>
          <RadioGroup.Hint>events: false skips.</RadioGroup.Hint>
        </RadioGroup.Legend>
        <RadioGroup.List>
          <Radio value="air" label="Air" />
        </RadioGroup.List>
      </RadioGroup>
    </div>
  );
}
