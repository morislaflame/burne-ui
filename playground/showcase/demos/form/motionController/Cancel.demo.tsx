import { Button } from "@/components/core/Button";
import { Form } from "@/components/composite/Form";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "form:pulse": (ctx) =>
    ctx.fromRest({
      y: -4,
      duration: 0.35,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    }),
});

export function FormMotionControllerCancelDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.play("form:pulse")}>
          Loop
        </Button>
        <Button
          size="small"
          variant="ghost"
          onClick={() => {
            controller.cancel("root");
            controller.set("root", { y: 0 });
          }}
        >
          Cancel
        </Button>
      </div>
      <Form aria-label="Cancel loop" motionController={controller} motion={{ events }}>
        <Form.Header>
          <Form.Title>Profile</Form.Title>
          <Form.Description>Cancel the looping root tween.</Form.Description>
        </Form.Header>
      </Form>
    </div>
  );
}
