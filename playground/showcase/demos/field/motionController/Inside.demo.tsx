import { Field } from "@/components/core/Field";
import { createMotionEvents, useMotionController } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "field:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

function HintPulse() {
  const controller = useMotionController();
  return (
    <Field.Hint onPointerEnter={() => controller.playSlot("hint", "field:nudge")}>
      Hover the hint
    </Field.Hint>
  );
}

export function FieldMotionControllerInsideDemo() {
  return (
    <div className="w-full max-w-sm">
      <Field motion={{ events }}>
        <Field.Label>Email</Field.Label>
        <HintPulse />
      </Field>
    </div>
  );
}
