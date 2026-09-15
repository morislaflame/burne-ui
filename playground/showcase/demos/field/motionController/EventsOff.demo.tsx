import { Button } from "@/components/core/Button";
import { Field } from "@/components/core/Field";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const live = createMotionEvents({
  "field:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});
const off = createMotionEvents({ "field:nudge": false });

export function FieldMotionEventsOffDemo() {
  const liveController = useMotionControllerHandle();
  const offController = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => liveController.play("field:nudge")}>
          Live nudge
        </Button>
        <Button size="small" variant="ghost" onClick={() => offController.play("field:nudge")}>
          Off nudge
        </Button>
      </div>
      <Field motionController={liveController} motion={{ events: live }}>
        <Field.Label>Live</Field.Label>
        <Field.Hint>Events play.</Field.Hint>
      </Field>
      <Field motionController={offController} motion={{ events: off }}>
        <Field.Label>Off</Field.Label>
        <Field.Hint>events: false skips.</Field.Hint>
      </Field>
    </div>
  );
}
