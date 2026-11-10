import { Button } from "@/components/core/Button";
import { ColorSlider } from "@/components/core/ColorPicker";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function ColorSliderMotionControllerPlayRootDemo() {
  const controller = useMotionControllerHandle();
  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.play("hoverIn")}>play(root)</Button>
        <Button size="small" variant="outline" onClick={() => controller.play("hoverOut")}>Reset</Button>
        <Button size="small" variant="ghost" onClick={() => controller.set("root", { y: 0 })}>Snap</Button>
      </div>
      <ColorSlider className="w-full max-w-sm" channel="hue" motionController={controller} motion={{ root: { hoverIn: { y: -4, duration: 0.28, replay: "rest" }, hoverOut: { y: 0, duration: 0.2 } } }}>
        <ColorSlider.Track channel="hue" defaultValue={180} />
      </ColorSlider>
    </div>
  );
}
