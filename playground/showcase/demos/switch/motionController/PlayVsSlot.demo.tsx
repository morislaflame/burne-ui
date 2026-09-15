import { Button } from "@/components/core/Button";
import { Switch } from "@/components/core/Switch";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function SwitchMotionControllerPlayVsSlotDemo() {
  const controller = useMotionControllerHandle();
  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.play("hoverIn")}>play() skip</Button>
        <Button size="small" variant="outline" onClick={() => controller.playSlot("track", "hoverIn")}>playSlot(track)</Button>
        <Button size="small" variant="outline" onClick={() => void controller.playAll("hoverIn")}>playAll()</Button>
        <Button size="small" variant="ghost" onClick={() => void controller.playAll("hoverOut")}>Reset</Button>
      </div>
      <Switch label="Notify" defaultChecked motionController={controller} motion={{ track: { hoverIn: { y: -4, duration: 0.28, replay: "rest" }, hoverOut: { y: 0, duration: 0.2 } }, fill: { hoverIn: (ctx) => ctx.fromRest({ opacity: 0.45, duration: 0.22 }), hoverOut: (ctx) => ctx.to({ opacity: 1, duration: 0.16 }) } }} />
    </div>
  );
}
