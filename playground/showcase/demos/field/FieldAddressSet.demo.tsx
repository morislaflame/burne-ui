import { Field } from "@/components/core/Field";
import { Input } from "@/components/core/Input";

export function FieldAddressSetDemo() {
  return (
    <Field.Set className="max-w-md">
      <Field.Legend>
        <Field.LegendHeader>
          <Field.Label>Delivery address</Field.Label>
          <Field.Hint as="span">Please provide a current address</Field.Hint>
        </Field.LegendHeader>
      </Field.Legend>
      <Field.Group>
        <Input>
          <Input.Label>City</Input.Label>
          <Input.Control placeholder="Moscow" />
        </Input>
      </Field.Group>
    </Field.Set>
  );
}
