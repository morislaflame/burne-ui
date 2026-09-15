import { Button } from "@/components/core/Button";
import { ColorSwatch } from "@/components/core/ColorPicker";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({ "swatch:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" } });

export function ColorSwatchMotionEventsPingDemo() {
  const controller = useMotionControllerHandle();
  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.play("swatch:nudge")}>Nudge</Button>
      <ColorSwatch color="#3b82f6" size="large" aria-label="Accent" onClick={() => undefined} motionController={controller} motion={{ events }} />
    </div>
  );
}
