import { Button } from "@/components/core/Button";
import { ColorSlider } from "@/components/core/ColorPicker";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({ "slider:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" } });

export function ColorSliderMotionEventsPingDemo() {
  const controller = useMotionControllerHandle();
  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.playSlot("track", "slider:nudge")}>Nudge</Button>
      <ColorSlider className="w-full max-w-sm" channel="hue" defaultValue={180} label="Hue" motionController={controller} motion={{ events }} />
    </div>
  );
}
