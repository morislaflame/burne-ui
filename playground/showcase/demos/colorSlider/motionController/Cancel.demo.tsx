import { Button } from "@/components/core/Button";
import { ColorSlider } from "@/components/core/ColorPicker";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({ "slider:pulse": (ctx) => ctx.fromRest({ y: -4, duration: 0.35, yoyo: true, repeat: -1, ease: "sine.inOut" }) });

export function ColorSliderMotionControllerCancelDemo() {
  const controller = useMotionControllerHandle();
  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("track", "slider:pulse")}>Loop</Button>
        <Button size="small" variant="ghost" onClick={() => { controller.cancel("track"); controller.set("track", { y: 0 }); }}>Cancel</Button>
      </div>
      <ColorSlider className="w-full max-w-sm" channel="hue" defaultValue={180} label="Hue" motionController={controller} motion={{ events }} />
    </div>
  );
}
