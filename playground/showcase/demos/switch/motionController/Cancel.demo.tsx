import { Button } from "@/components/core/Button";
import { Switch } from "@/components/core/Switch";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({ "switch:pulse": (ctx) => ctx.fromRest({ y: -4, duration: 0.35, yoyo: true, repeat: -1, ease: "sine.inOut" }) });

export function SwitchMotionControllerCancelDemo() {
  const controller = useMotionControllerHandle();
  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("track", "switch:pulse")}>Loop</Button>
        <Button size="small" variant="ghost" onClick={() => { controller.cancel("track"); controller.set("track", { y: 0 }); }}>Cancel</Button>
      </div>
      <Switch label="Notify" defaultChecked motionController={controller} motion={{ events }} />
    </div>
  );
}
