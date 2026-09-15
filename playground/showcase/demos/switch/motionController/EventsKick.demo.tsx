import { Button } from "@/components/core/Button";
import { Switch } from "@/components/core/Switch";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "switch:scan": (ctx) => {
    const tl = ctx.timeline();
    tl.fromRest(ctx.el, { y: -6, duration: 0.16 }, 0);
    if (ctx.targets.fill) tl.fromRest(ctx.targets.fill, { opacity: 0.4, duration: 0.16 }, 0);
    tl.to(ctx.el, { y: 0, duration: 0.22 }, 0.2);
    if (ctx.targets.fill) tl.to(ctx.targets.fill, { opacity: 1, duration: 0.22 }, 0.2);
    return tl;
  },
});

export function SwitchMotionEventsKickDemo() {
  const controller = useMotionControllerHandle();
  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.playSlot("track", "switch:scan")}>Scan</Button>
      <Switch label="Notify" defaultChecked motionController={controller} motion={{ events }} />
    </div>
  );
}
