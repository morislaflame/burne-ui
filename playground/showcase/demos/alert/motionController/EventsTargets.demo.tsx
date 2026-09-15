import { Alert } from "@/components/core/Alert";
import { Button } from "@/components/core/Button";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "notify:attention": (ctx) =>
    ctx
      .timeline()
      .fromRest(ctx.targets.indicator, { rotate: -12, scale: 1.12, duration: 0.22, ease: "back.out(2)" }, 0)
      .fromRest(ctx.targets.title, { y: -4, duration: 0.22 }, 0.04),
  "notify:rest": (ctx) =>
    ctx
      .timeline()
      .to(ctx.targets.indicator, { rotate: 0, scale: 1, duration: 0.2 }, 0)
      .to(ctx.targets.title, { y: 0, duration: 0.2 }, 0),
});

export function AlertMotionEventsTargetsDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.play("notify:attention")}>
          Attention
        </Button>
        <Button size="small" variant="ghost" onClick={() => controller.play("notify:rest")}>
          Rest
        </Button>
      </div>
      <Alert
        status="warning"
        title="ctx.targets"
        description="One event factory tweens indicator + title."
        hoverLift={false}
        motionController={controller}
        motion={{ events }}
      />
    </div>
  );
}
