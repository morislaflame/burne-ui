import { Button } from "@/components/core/Button";
import { Radio } from "@/components/core/Radio";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({ "radio:pulse": (ctx) => ctx.fromRest({ y: -4, duration: 0.35, yoyo: true, repeat: -1, ease: "sine.inOut" }) });

export function RadioMotionControllerCancelDemo() {
  const controller = useMotionControllerHandle();
  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("root", "radio:pulse")}>Loop</Button>
        <Button size="small" variant="ghost" onClick={() => { controller.cancel("root"); controller.set("root", { y: 0 }); }}>Cancel</Button>
      </div>
      <Radio label="Notify" defaultChecked motionController={controller} motion={{ events }} />
    </div>
  );
}
