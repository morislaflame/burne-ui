import { Button } from "@/components/core/Button";
import { SelectionIndicator } from "@/components/core/SelectionIndicator";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function SelectionIndicatorMotionControllerStaggerDemo() {
  const controller = useMotionControllerHandle();
  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => void controller.playAll("check", { stagger: 0.08 })}>Stagger</Button>
      <SelectionIndicator selected check size="large" motionController={controller} motion={{ root: { check: { y: -4, duration: 0.28, replay: "rest" } }, fill: { check: (ctx) => ctx.fromRest({ scale: 1.12, duration: 0.22 }) }, mark: { check: (ctx) => ctx.fromRest({ rotation: 14, duration: 0.22 }) } }} />
    </div>
  );
}
