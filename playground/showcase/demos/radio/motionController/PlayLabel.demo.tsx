import { Button } from "@/components/core/Button";
import { Radio } from "@/components/core/Radio";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function RadioMotionControllerPlayLabelDemo() {
  const controller = useMotionControllerHandle();
  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("label", "check")}>playSlot(label)</Button>
        <Button size="small" variant="outline" onClick={() => controller.playSlot("hint", "check")}>playSlot(hint)</Button>
        <Button size="small" variant="ghost" onClick={() => void controller.playAll("uncheck")}>Reset</Button>
      </div>
      <Radio defaultChecked motionController={controller} motion={{ label: { check: { y: -4, duration: 0.22, replay: "rest" }, uncheck: { y: 0, duration: 0.16 } }, hint: { check: { y: -4, duration: 0.22, replay: "rest" }, uncheck: { y: 0, duration: 0.16 } } }}>
        <Radio.Control />
        <Radio.Content>
          <Radio.Label>Chrome</Radio.Label>
          <Radio.Hint>Root scope, not indicator</Radio.Hint>
        </Radio.Content>
      </Radio>
    </div>
  );
}
