import { Button } from "@/components/core/Button";
import { Label } from "@/components/core/Label";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "label:kick": (ctx) => {
    const tl = ctx.timeline();
    tl.fromRest(ctx.el, { y: -6, duration: 0.16, ease: "power2.out" }, 0);
    if (ctx.targets.text) {
      tl.fromRest(ctx.targets.text, { y: -8, duration: 0.18 }, 0);
    }
    if (ctx.targets.required) {
      tl.fromRest(ctx.targets.required, { y: -10, duration: 0.18 }, 0.04);
    }
    tl.to(ctx.el, { y: 0, duration: 0.24, ease: "power2.inOut" }, 0.22);
    if (ctx.targets.text) {
      tl.to(ctx.targets.text, { y: 0, duration: 0.22 }, 0.22);
    }
    if (ctx.targets.required) {
      tl.to(ctx.targets.required, { y: 0, duration: 0.22 }, 0.22);
    }
    return tl;
  },
});

export function LabelMotionEventsKickDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.play("label:kick")}>
        Kick
      </Button>
      <Label required motionController={controller} motion={{ events }}>
        Email
      </Label>
    </div>
  );
}
