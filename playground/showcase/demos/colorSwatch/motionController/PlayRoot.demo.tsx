import { Button } from "@/components/core/Button";
import { ColorSwatch } from "@/components/core/ColorPicker";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function ColorSwatchMotionControllerDemo() {
  const controller = useMotionControllerHandle();
  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.play("hoverIn")}>Pulse</Button>
        <Button size="small" variant="outline" onClick={() => controller.play("hoverOut")}>Reset</Button>
        <Button size="small" variant="ghost" onClick={() => controller.set("root", { y: 0 })}>Snap</Button>
      </div>
      <ColorSwatch color="#3b82f6" size="large" aria-label="Accent" onClick={() => undefined} motionController={controller} motion={{ root: { hoverIn: { y: -6, duration: 0.28, replay: "rest" }, hoverOut: { y: 0, duration: 0.2 } } }} />
    </div>
  );
}
