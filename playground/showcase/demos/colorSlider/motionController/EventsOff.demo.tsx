import { Button } from "@/components/core/Button";
import { ColorSlider } from "@/components/core/ColorPicker";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const live = createMotionEvents({ "slider:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" } });
const off = createMotionEvents({ "slider:nudge": false });

export function ColorSliderMotionEventsOffDemo() {
  const liveController = useMotionControllerHandle();
  const offController = useMotionControllerHandle();
  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => liveController.playSlot("track", "slider:nudge")}>Live</Button>
        <Button size="small" variant="ghost" onClick={() => offController.playSlot("track", "slider:nudge")}>Off</Button>
      </div>
      <ColorSlider className="w-full max-w-sm" channel="hue" defaultValue={180} label="Live" motionController={liveController} motion={{ events: live }} />
      <ColorSlider className="w-full max-w-sm" channel="hue" defaultValue={180} label="Off" motionController={offController} motion={{ events: off }} />
    </div>
  );
}
