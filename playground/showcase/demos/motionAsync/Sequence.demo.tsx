import { Alert } from "@/components/core/Alert";
import { Button } from "@/components/core/Button";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "async:sequence": (ctx) =>
    ctx.sequence(
      () => ctx.fromRest({ y: -12, duration: 0.16 }),
      0.1,
      () => ctx.to({ scale: 1.04, duration: 0.16, ease: "back.out(2)" }),
      () => ctx.to({ y: 0, scale: 1, duration: 0.22 }),
    ),
  "async:parallel": (ctx) =>
    ctx.parallel(
      () => ctx.fromRest(ctx.getTarget("title"), { y: -6, duration: 0.22 }),
      () => ctx.fromRest(ctx.getTarget("description"), { y: -6, duration: 0.22 }),
    ).then(() =>
      ctx.parallel(
        () => ctx.to(ctx.getTarget("title"), { y: 0, duration: 0.2 }),
        () => ctx.to(ctx.getTarget("description"), { y: 0, duration: 0.2 }),
      ),
    ),
});

export function MotionAsyncSequenceDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => void controller.play("async:sequence")}>
          Sequence
        </Button>
        <Button size="small" variant="outline" onClick={() => void controller.play("async:parallel")}>
          Parallel
        </Button>
      </div>
      <Alert
        status="info"
        title="Title slot"
        description="Description slot — parallel lifts both."
        hoverLift={false}
        motionController={controller}
        motion={{ events }}
      />
    </div>
  );
}
