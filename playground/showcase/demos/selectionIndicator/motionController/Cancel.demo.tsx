import { Button } from "@/components/core/Button";
import { SelectionIndicator } from "@/components/core/SelectionIndicator";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({ "indicator:pulse": (ctx) => ctx.fromRest({ y: -4, duration: 0.35, yoyo: true, repeat: -1, ease: "sine.inOut" }) });

export function SelectionIndicatorMotionControllerCancelDemo() {
  const controller = useMotionControllerHandle();
  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.play("indicator:pulse")}>Loop</Button>
        <Button size="small" variant="ghost" onClick={() => { controller.cancel(); controller.set("root", { y: 0 }); }}>Cancel</Button>
      </div>
      <SelectionIndicator selected check size="large" motionController={controller} motion={{ events }} />
    </div>
  );
}
