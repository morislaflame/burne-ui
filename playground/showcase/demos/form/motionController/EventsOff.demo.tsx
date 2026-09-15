import { Button } from "@/components/core/Button";
import { Form } from "@/components/composite/Form";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const live = createMotionEvents({
  "form:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});
const off = createMotionEvents({ "form:nudge": false });

export function FormMotionEventsOffDemo() {
  const liveController = useMotionControllerHandle();
  const offController = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => liveController.play("form:nudge")}>
          Live nudge
        </Button>
        <Button size="small" variant="ghost" onClick={() => offController.play("form:nudge")}>
          Off nudge
        </Button>
      </div>
      <Form aria-label="Live events" motionController={liveController} motion={{ events: live }}>
        <Form.Header>
          <Form.Title>Live</Form.Title>
          <Form.Description>Events play.</Form.Description>
        </Form.Header>
      </Form>
      <Form aria-label="Off events" motionController={offController} motion={{ events: off }}>
        <Form.Header>
          <Form.Title>Off</Form.Title>
          <Form.Description>events: false skips.</Form.Description>
        </Form.Header>
      </Form>
    </div>
  );
}
