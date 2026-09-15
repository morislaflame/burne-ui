import { Button } from "@/components/core/Button";
import { ColorSwatch } from "@/components/core/ColorPicker";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const live = createMotionEvents({ "swatch:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" } });
const off = createMotionEvents({ "swatch:nudge": false });

export function ColorSwatchMotionEventsOffDemo() {
  const liveController = useMotionControllerHandle();
  const offController = useMotionControllerHandle();
  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => liveController.play("swatch:nudge")}>Live</Button>
        <Button size="small" variant="ghost" onClick={() => offController.play("swatch:nudge")}>Off</Button>
      </div>
      <div className="flex items-center gap-large">
        <ColorSwatch color="#3b82f6" size="large" aria-label="Live" onClick={() => undefined} motionController={liveController} motion={{ events: live }} />
        <ColorSwatch color="#22c55e" size="large" aria-label="Off" onClick={() => undefined} motionController={offController} motion={{ events: off }} />
      </div>
    </div>
  );
}
