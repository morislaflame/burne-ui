import { Button } from "@/components/core/Button";
import { Form } from "@/components/composite/Form";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "form:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

export function FormMotionEventsPingDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.play("form:nudge")}>
        Nudge
      </Button>
      <Form aria-label="Events yoyo" motionController={controller} motion={{ events }}>
        <Form.Header>
          <Form.Title>Profile</Form.Title>
          <Form.Description>Root yoyo on the Form scope.</Form.Description>
        </Form.Header>
      </Form>
    </div>
  );
}
