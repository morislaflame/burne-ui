import { Button } from "@/components/core/Button";
import { Form } from "@/components/composite/Form";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "form:kick": (ctx) => {
    const tl = ctx.timeline();
    tl.fromRest(ctx.el, { y: -6, duration: 0.16, ease: "power2.out" }, 0);
    if (ctx.targets.title) {
      tl.fromRest(ctx.targets.title, { y: -8, duration: 0.18 }, 0);
    }
    if (ctx.targets.description) {
      tl.fromRest(ctx.targets.description, { y: -10, duration: 0.18 }, 0.04);
    }
    tl.to(ctx.el, { y: 0, duration: 0.24, ease: "power2.inOut" }, 0.22);
    if (ctx.targets.title) {
      tl.to(ctx.targets.title, { y: 0, duration: 0.22 }, 0.22);
    }
    if (ctx.targets.description) {
      tl.to(ctx.targets.description, { y: 0, duration: 0.22 }, 0.22);
    }
    return tl;
  },
});

export function FormMotionEventsKickDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.play("form:kick")}>
        Kick
      </Button>
      <Form aria-label="Events kick" motionController={controller} motion={{ events }}>
        <Form.Header>
          <Form.Title>Profile</Form.Title>
          <Form.Description>Kick hits title + description via ctx.targets.</Form.Description>
        </Form.Header>
      </Form>
    </div>
  );
}
