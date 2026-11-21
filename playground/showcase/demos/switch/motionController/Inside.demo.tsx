import { Switch } from "@/components/core/Switch";
import { createMotionEvents, useMotionController } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({ "switch:nudge": { y: -4, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" } });

function LabelPulse() {
  const controller = useMotionController();
  return <Switch.Label onPointerEnter={() => controller.playSlot("label", "switch:nudge")}>Hover label</Switch.Label>;
}

export function SwitchMotionControllerInsideDemo() {
  return (
    <Switch defaultChecked motion={{ events }}>
      <Switch.Control />
      <Switch.Content>
        <LabelPulse />
        <Switch.Hint>Root chrome scope</Switch.Hint>
      </Switch.Content>
    </Switch>
  );
}
