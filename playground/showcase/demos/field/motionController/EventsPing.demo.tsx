import { Button } from "@/components/core/Button";
import { Field } from "@/components/core/Field";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "field:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

export function FieldMotionEventsPingDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.play("field:nudge")}>
        Nudge
      </Button>
      <Field motionController={controller} motion={{ events }}>
        <Field.Label>Email</Field.Label>
        <Field.Hint>Root yoyo on the Field scope.</Field.Hint>
      </Field>
    </div>
  );
}
