import { Button } from "@/components/core/Button";
import { Meter } from "@/components/core/Meter";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "meter:kick": (ctx) => {
    const tl = ctx.timeline();
    tl.fromRest(ctx.el, { y: -6, duration: 0.16, ease: "power2.out" }, 0);
    if (ctx.targets.fill) {
      tl.fromRest(ctx.targets.fill, { opacity: 0.4, duration: 0.18 }, 0);
    }
    tl.to(ctx.el, { y: 0, duration: 0.24, ease: "power2.inOut" }, 0.22);
    if (ctx.targets.fill) {
      tl.to(ctx.targets.fill, { opacity: 1, duration: 0.22 }, 0.22);
    }
    return tl;
  },
});

export function MeterMotionEventsKickDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.playSlot("track", "meter:kick")}>
        Kick
      </Button>
      <Meter
        label="Storage"
        showValue
        value={62}
        motionController={controller}
        motion={{ events }}
      />
    </div>
  );
}
