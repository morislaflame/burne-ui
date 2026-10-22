import { RadioGroup } from "@/components/composite/RadioGroup";
import { Radio } from "@/components/core/Radio";
import { createMotionEvents, useMotionController } from "@/components/core/utils/slotMotion";
import { Label } from "@/components/core/Label";

const events = createMotionEvents({
  "choice:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

function HintPulse() {
  const controller = useMotionController();
  return (
    <RadioGroup.Hint onPointerEnter={() => controller.playSlot("hint", "choice:nudge")}>
      Hover the hint
    </RadioGroup.Hint>
  );
}

export function RadioGroupMotionControllerInsideDemo() {
  return (
    <div className="w-full max-w-sm">
      <RadioGroup aria-label="Shipping" motion={{ events }}>
        <RadioGroup.Legend>
          <Label>Shipping</Label>
          <HintPulse />
        </RadioGroup.Legend>
        <RadioGroup.List>
          <Radio value="ground" label="Ground" />
          <Radio value="air" label="Air" />
        </RadioGroup.List>
      </RadioGroup>
    </div>
  );
}
