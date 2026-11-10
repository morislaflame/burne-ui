import { Button } from "@/components/core/Button";
import { ColorSwatch } from "@/components/core/ColorPicker";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "swatch:stack": (ctx) => {
    const tl = ctx.timeline();
    tl.fromRest(ctx.el, { y: -12, duration: 0.18, ease: "power2.out" }, 0);
    tl.to(ctx.el, { scale: 1.08, duration: 0.16, ease: "back.out(1.8)" }, 0.1);
    tl.to(ctx.el, { y: 0, scale: 1, duration: 0.24, ease: "power2.inOut" }, 0.32);
    return tl;
  },
});

export function ColorSwatchMotionEventsTimelineDemo() {
  const controller = useMotionControllerHandle();
  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.play("swatch:stack")}>Stack</Button>
      <ColorSwatch color="#3b82f6" size="large" aria-label="Accent" onClick={() => undefined} motionController={controller} motion={{ events }} />
    </div>
  );
}
