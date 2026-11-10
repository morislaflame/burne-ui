import { Field } from "@/components/core/Field";
import { Input } from "@/components/core/Input";

export function FieldMotionInstantEnterDemo() {
  return (
    <Field motion={{ root: { enter: false } }}>
      <Field.Label>Name</Field.Label>
      <Input>
        <Input.Control placeholder="Skip enter" />
      </Input>
    </Field>
  );
}
