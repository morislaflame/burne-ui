import { Button } from "@/components/core/Button";
import { Switch } from "@/components/core/Switch";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({ "switch:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" } });

export function SwitchMotionEventsPingDemo() {
  const controller = useMotionControllerHandle();
  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.playSlot("track", "switch:nudge")}>Nudge</Button>
      <Switch label="Notify" defaultChecked motionController={controller} motion={{ events }} />
    </div>
  );
}
