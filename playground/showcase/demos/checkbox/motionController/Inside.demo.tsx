import { Checkbox } from "@/components/core/Checkbox";
import { createMotionEvents, useMotionController } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({ "check:nudge": { y: -4, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" } });

function LabelPulse() {
  const controller = useMotionController();
  return <Checkbox.Label onPointerEnter={() => controller.playSlot("label", "check:nudge")}>Hover label</Checkbox.Label>;
}

export function CheckboxMotionControllerInsideDemo() {
  return (
    <Checkbox defaultChecked motion={{ events }}>
      <Checkbox.Control />
      <Checkbox.Content>
        <LabelPulse />
        <Checkbox.Hint>Root chrome scope</Checkbox.Hint>
      </Checkbox.Content>
    </Checkbox>
  );
}
