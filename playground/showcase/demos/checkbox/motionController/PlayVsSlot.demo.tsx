import { Button } from "@/components/core/Button";
import { Checkbox } from "@/components/core/Checkbox";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function CheckboxMotionControllerPlayVsSlotDemo() {
  const controller = useMotionControllerHandle();
  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.play("check")}>play(root)</Button>
        <Button size="small" variant="outline" onClick={() => controller.playSlot("fill", "check")}>playSlot(fill)</Button>
        <Button size="small" variant="outline" onClick={() => void controller.playAll("check")}>playAll()</Button>
        <Button size="small" variant="ghost" onClick={() => void controller.playAll("uncheck")}>Reset</Button>
      </div>
      <Checkbox label="Notify" defaultChecked motionController={controller} motion={{
        indicator: { check: { y: -4, duration: 0.28, replay: "rest" }, uncheck: { y: 0, duration: 0.2 } },
        indicatorFill: { check: (ctx) => ctx.fromRest({ opacity: 0.45, duration: 0.22 }), uncheck: (ctx) => ctx.to({ opacity: 1, duration: 0.16 }) },
      }} />
    </div>
  );
}
