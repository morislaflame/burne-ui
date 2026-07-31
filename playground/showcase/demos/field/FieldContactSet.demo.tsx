import { Button } from "@/components/core/Button";
import { Field } from "@/components/core/Field";
import { Input } from "@/components/core/Input";

export function FieldContactSetDemo() {
  return (
    <Field.Set className="max-w-md">
      <Field.Legend>
        <Field.LegendHeader>
          <Field.Label>Contact details</Field.Label>
          <Field.Hint as="span">All fields are required</Field.Hint>
        </Field.LegendHeader>
      </Field.Legend>
      <Field.Group>
        <Input>
          <Input.Label>Telephone</Input.Label>
          <Input.Control placeholder="+7 …" />
        </Input>
        <Input status="danger">
          <Input.Label>Email</Input.Label>
          <Input.Control defaultValue="bad@" />
          <Input.Error>Invalid address.</Input.Error>
        </Input>
      </Field.Group>
      <Field.Actions>
        <Button type="button" size="base">
          Save
        </Button>
        <Button type="button" variant="ghost" size="base">
          Cancel
        </Button>
      </Field.Actions>
    </Field.Set>
  );
}
