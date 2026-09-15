import { Badge } from "@/components/core/Badge";
import { Button } from "@/components/core/Button";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "notify:stack": (ctx) => {
    const tl = ctx.timeline();
    tl.fromRest(ctx.el, { y: -10, duration: 0.16, ease: "power2.out" }, 0);
    tl.to(ctx.el, { scale: 1.12, duration: 0.16, ease: "back.out(2)" }, 0.08);
    tl.to(ctx.el, { y: 0, scale: 1, duration: 0.22, ease: "power2.inOut" }, 0.28);
    return tl;
  },
});

export function BadgeMotionEventsTimelineDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.play("notify:stack")}>
        Stack
      </Button>
      <Badge status="info" hoverLift={false} motionController={controller} motion={{ events }}>
        y then scale then rest
      </Badge>
    </div>
  );
}
