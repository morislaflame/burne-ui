import { Button } from "@/components/core/Button";
import { ColorSlider } from "@/components/core/ColorPicker";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function ColorSliderMotionControllerDemo() {
  const controller = useMotionControllerHandle();
  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("track", "hoverIn")}>Pulse</Button>
        <Button size="small" variant="outline" onClick={() => controller.playSlot("track", "hoverOut")}>Reset</Button>
        <Button size="small" variant="ghost" onClick={() => controller.set("track", { y: 0 })}>Snap</Button>
      </div>
      <ColorSlider className="w-full max-w-sm" channel="hue" defaultValue={180} label="Hue" motionController={controller} motion={{ track: { hoverIn: { y: -4, duration: 0.28, replay: "rest" }, hoverOut: { y: 0, duration: 0.2 } } }} />
    </div>
  );
}
