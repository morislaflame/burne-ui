import { Button } from "@/components/core/Button";
import { Checkbox } from "@/components/core/Checkbox";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function CheckboxMotionControllerDemo() {
  const controller = useMotionControllerHandle();
  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("root", "check")}>Pulse</Button>
        <Button size="small" variant="outline" onClick={() => controller.playSlot("root", "uncheck")}>Reset</Button>
        <Button size="small" variant="ghost" onClick={() => controller.set("root", { y: 0 })}>Snap</Button>
      </div>
      <Checkbox label="Notify" defaultChecked motionController={controller} motion={{ indicator: { check: { y: -4, duration: 0.28, replay: "rest" }, uncheck: { y: 0, duration: 0.2 } } }} />
    </div>
  );
}
