import { CheckboxGroup } from "@/components/composite/CheckboxGroup";
import { Checkbox } from "@/components/core/Checkbox";
import { createMotionEvents, useMotionController } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "checks:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

function HintPulse() {
  const controller = useMotionController();
  return (
    <CheckboxGroup.Hint onPointerEnter={() => controller.playSlot("hint", "checks:nudge")}>
      Hover the hint
    </CheckboxGroup.Hint>
  );
}

export function CheckboxGroupMotionControllerInsideDemo() {
  return (
    <div className="w-full max-w-sm">
      <CheckboxGroup motion={{ events }}>
        <CheckboxGroup.Legend>
          <CheckboxGroup.Label>Plan</CheckboxGroup.Label>
          <HintPulse />
        </CheckboxGroup.Legend>
        <CheckboxGroup.List>
          <Checkbox value="pro" label="Pro" />
          <Checkbox value="team" label="Team" />
        </CheckboxGroup.List>
      </CheckboxGroup>
    </div>
  );
}
