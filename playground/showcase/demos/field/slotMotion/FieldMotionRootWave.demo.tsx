import { Field } from "@/components/core/Field";
import { Input } from "@/components/core/Input";

export function FieldMotionRootWaveDemo() {
  return (
    <Field
      motion={{
        root: {
          enter: (ctx) =>
            ctx.fromTo({ opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3 }),
        },
        hint: {
          enter: (ctx) => ctx.fromTo({ x: -6 }, { x: 0, duration: 0.22 }),
        },
      }}
    >
      <Field.Label>Email</Field.Label>
      <Input>
        <Input.Control placeholder="you@burne.dev" />
      </Input>
      <Field.Hint>Does not steal Input motion</Field.Hint>
    </Field>
  );
}
