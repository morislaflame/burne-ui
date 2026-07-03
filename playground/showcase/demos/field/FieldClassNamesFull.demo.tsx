import { Button } from "@/components/core/Button";
import { Field } from "@/components/core/Field";
import { Input } from "@/components/core/Input";
import { Label } from "@/components/core/Label";

export function FieldClassNamesFullDemo() {
  return (
    <Field
      className="max-w-sm"
      classNames={{
        root: "rounded-mid border border-primary/20 p-base",
        hint: "text-foreground/70",
        error: "font-medium",
      }}
    >
      <Field.Label htmlFor="field-demo-email">Email</Field.Label>
      <Input.Control id="field-demo-email" placeholder="you@example.com" status="danger" />
      <Field.Hint>We do not share the address with third parties.</Field.Hint>
      <Field.Error>Please enter correct email.</Field.Error>
    </Field>
  );
}

export function FieldSetClassNamesFullDemo() {
  return (
    <Field.Set
      className="max-w-md"
      classNames={{
        stack: "gap-xlarge mt-xlarge",
      }}
    >
      <Field.Legend>
        <Field.LegendHeader>
          <Label>Contact details</Label>
          <Field.Hint as="span">classNames on Field.Set</Field.Hint>
        </Field.LegendHeader>
      </Field.Legend>
      <Field.Group>
        <Input>
          <Input.Label>Telephone</Input.Label>
          <Input.Control placeholder="+7 …" />
        </Input>
      </Field.Group>
      <Field.Actions>
        <Button type="button" size="base">
          Save
        </Button>
      </Field.Actions>
    </Field.Set>
  );
}
