import { Button } from "@/components/core/Button";
import { TimeField } from "@/components/core/TimeField";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "time:kick": (ctx) => {
    const tl = ctx.timeline();
    tl.fromRest(ctx.el, { y: -6, duration: 0.16, ease: "power2.out" }, 0);
    if (ctx.targets.prefix) {
      tl.fromRest(ctx.targets.prefix, { y: -8, duration: 0.18 }, 0);
    }
    tl.to(ctx.el, { y: 0, duration: 0.24, ease: "power2.inOut" }, 0.22);
    if (ctx.targets.prefix) {
      tl.to(ctx.targets.prefix, { y: 0, duration: 0.22 }, 0.22);
    }
    return tl;
  },
});

export function TimeFieldMotionEventsKickDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.playSlot("shell", "time:kick")}>
        Kick
      </Button>
      <TimeField
        label="Start"
        defaultValue="09:30"
        prefix="@"
        motionController={controller}
        motion={{ events }}
      />
    </div>
  );
}
