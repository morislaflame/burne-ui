import { Button } from "@/components/core/Button";
import { SelectionIndicator } from "@/components/core/SelectionIndicator";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function SelectionIndicatorMotionControllerPlayVsSlotDemo() {
  const controller = useMotionControllerHandle();
  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.play("check")}>play()</Button>
        <Button size="small" variant="outline" onClick={() => controller.playSlot("fill", "check")}>playSlot(fill)</Button>
        <Button size="small" variant="outline" onClick={() => void controller.playAll("check")}>playAll()</Button>
        <Button size="small" variant="ghost" onClick={() => void controller.playAll("uncheck")}>Reset</Button>
      </div>
      <SelectionIndicator selected check size="large" motionController={controller} motion={{ root: { check: { y: -4, duration: 0.28, replay: "rest" }, uncheck: { y: 0, duration: 0.2 } }, fill: { check: (ctx) => ctx.fromRest({ scale: 1.12, duration: 0.22 }), uncheck: (ctx) => ctx.to({ scale: 1, duration: 0.16 }) } }} />
    </div>
  );
}
