import { Button } from "@/components/core/Button";
import { Checkbox } from "@/components/core/Checkbox";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({ "check:pulse": (ctx) => ctx.fromRest({ y: -4, duration: 0.35, yoyo: true, repeat: -1, ease: "sine.inOut" }) });

export function CheckboxMotionControllerCancelDemo() {
  const controller = useMotionControllerHandle();
  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("root", "check:pulse")}>Loop</Button>
        <Button size="small" variant="ghost" onClick={() => { controller.cancel("root"); controller.set("root", { y: 0 }); }}>Cancel</Button>
      </div>
      <Checkbox label="Notify" defaultChecked motionController={controller} motion={{ events }} />
    </div>
  );
}
