import { Button } from "@/components/core/Button";
import { ColorSwatch } from "@/components/core/ColorPicker";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({ "swatch:pulse": (ctx) => ctx.fromRest({ y: -4, duration: 0.35, yoyo: true, repeat: -1, ease: "sine.inOut" }) });

export function ColorSwatchMotionControllerCancelDemo() {
  const controller = useMotionControllerHandle();
  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.play("swatch:pulse")}>Loop</Button>
        <Button size="small" variant="ghost" onClick={() => { controller.cancel(); controller.set("root", { y: 0 }); }}>Cancel</Button>
      </div>
      <ColorSwatch color="#3b82f6" size="large" aria-label="Accent" onClick={() => undefined} motionController={controller} motion={{ events }} />
    </div>
  );
}
