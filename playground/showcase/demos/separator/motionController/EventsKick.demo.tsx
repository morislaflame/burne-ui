import { Button } from "@/components/core/Button";
import { Separator } from "@/components/core/Separator";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "sep:kick": (ctx) => {
    const tl = ctx.timeline();
    tl.fromRest(ctx.el, { y: -8, duration: 0.16, ease: "power2.out" }, 0);
    tl.fromRest(ctx.el, { opacity: 0.45, duration: 0.18 }, 0);
    tl.to(ctx.el, { y: 0, duration: 0.24, ease: "power2.inOut" }, 0.22);
    tl.to(ctx.el, { opacity: 1, duration: 0.22 }, 0.22);
    return tl;
  },
});

export function SeparatorMotionEventsKickDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.play("sep:kick")}>
        Kick
      </Button>
      <Separator className="w-full" motionController={controller} motion={{ events }} />
    </div>
  );
}
