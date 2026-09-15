import { Button } from "@/components/core/Button";
import { Loading } from "@/components/core/Loading";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "load:kick": (ctx) => {
    const tl = ctx.timeline();
    tl.fromRest(ctx.el, { y: -8, duration: 0.16, ease: "power2.out" }, 0);
    if (ctx.targets.spinner) {
      tl.fromRest(ctx.targets.spinner, { opacity: 0.35, duration: 0.18 }, 0);
    }
    tl.to(ctx.el, { y: 0, duration: 0.24, ease: "power2.inOut" }, 0.22);
    if (ctx.targets.spinner) {
      tl.to(ctx.targets.spinner, { opacity: 1, duration: 0.22 }, 0.22);
    }
    return tl;
  },
});

export function LoadingMotionEventsKickDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex w-full flex-col items-start gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.play("load:kick")}>
        Kick
      </Button>
      <Loading size="large" label="Loading" motionController={controller} motion={{ events }} />
    </div>
  );
}
