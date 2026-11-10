import { Button } from "@/components/core/Button";
import { Checkbox } from "@/components/core/Checkbox";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function CheckboxMotionControllerPlayLabelDemo() {
  const controller = useMotionControllerHandle();
  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("label", "check")}>playSlot(label)</Button>
        <Button size="small" variant="outline" onClick={() => controller.playSlot("hint", "check")}>playSlot(hint)</Button>
        <Button size="small" variant="ghost" onClick={() => void controller.playAll("uncheck")}>Reset</Button>
      </div>
      <Checkbox defaultChecked motionController={controller} motion={{ label: { check: { y: -4, duration: 0.22, replay: "rest" }, uncheck: { y: 0, duration: 0.16 } }, hint: { check: { y: -4, duration: 0.22, replay: "rest" }, uncheck: { y: 0, duration: 0.16 } } }}>
        <Checkbox.Control />
        <Checkbox.Content>
          <Checkbox.Label>Chrome</Checkbox.Label>
          <Checkbox.Hint>Root scope, not indicator</Checkbox.Hint>
        </Checkbox.Content>
      </Checkbox>
    </div>
  );
}
