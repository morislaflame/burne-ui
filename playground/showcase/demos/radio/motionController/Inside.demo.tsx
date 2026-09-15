import { Radio } from "@/components/core/Radio";
import { createMotionEvents, useMotionController } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({ "radio:nudge": { y: -4, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" } });

function LabelPulse() {
  const controller = useMotionController();
  return <Radio.Label onPointerEnter={() => controller.playSlot("label", "radio:nudge")}>Hover label</Radio.Label>;
}

export function RadioMotionControllerInsideDemo() {
  return (
    <Radio defaultChecked motion={{ events }}>
      <Radio.Control />
      <Radio.Content>
        <LabelPulse />
        <Radio.Hint>Root chrome scope</Radio.Hint>
      </Radio.Content>
    </Radio>
  );
}
