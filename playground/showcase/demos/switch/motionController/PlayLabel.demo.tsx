import { Button } from "@/components/core/Button";
import { Switch } from "@/components/core/Switch";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function SwitchMotionControllerPlayLabelDemo() {
  const controller = useMotionControllerHandle();
  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("label", "hoverIn")}>playSlot(label)</Button>
        <Button size="small" variant="outline" onClick={() => controller.playSlot("hint", "hoverIn")}>playSlot(hint)</Button>
        <Button size="small" variant="ghost" onClick={() => void controller.playAll("hoverOut")}>Reset</Button>
      </div>
      <Switch motionController={controller} motion={{ label: { hoverIn: { y: -4, duration: 0.22, replay: "rest" }, hoverOut: { y: 0, duration: 0.16 } }, hint: { hoverIn: { y: -4, duration: 0.22, replay: "rest" }, hoverOut: { y: 0, duration: 0.16 } } }}>
        <Switch.Control defaultChecked />
        <Switch.Content>
          <Switch.Label>Chrome</Switch.Label>
          <Switch.Hint>Root scope, not Track</Switch.Hint>
        </Switch.Content>
      </Switch>
    </div>
  );
}
