import { Button } from "@/components/core/Button";
import { Field } from "@/components/core/Field";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "field:kick": (ctx) => {
    const tl = ctx.timeline();
    tl.fromRest(ctx.el, { y: -6, duration: 0.16, ease: "power2.out" }, 0);
    if (ctx.targets.label) {
      tl.fromRest(ctx.targets.label, { y: -8, duration: 0.18 }, 0);
    }
    if (ctx.targets.hint) {
      tl.fromRest(ctx.targets.hint, { y: -10, duration: 0.18 }, 0.04);
    }
    tl.to(ctx.el, { y: 0, duration: 0.24, ease: "power2.inOut" }, 0.22);
    if (ctx.targets.label) {
      tl.to(ctx.targets.label, { y: 0, duration: 0.22 }, 0.22);
    }
    if (ctx.targets.hint) {
      tl.to(ctx.targets.hint, { y: 0, duration: 0.22 }, 0.22);
    }
    return tl;
  },
});

export function FieldMotionEventsKickDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.play("field:kick")}>
        Kick
      </Button>
      <Field motionController={controller} motion={{ events }}>
        <Field.Label>Email</Field.Label>
        <Field.Hint>Kick hits label + hint via ctx.targets.</Field.Hint>
      </Field>
    </div>
  );
}
