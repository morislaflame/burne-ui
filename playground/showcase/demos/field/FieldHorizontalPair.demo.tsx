import { Field } from "@/components/core/Field";
import { Input } from "@/components/core/Input";

export function FieldHorizontalPairDemo() {
  return (
    <Field.Set className="w-full max-w-lg">
      <Field.Legend>
        <Field.LegendHeader>
          <Field.Label>Report period</Field.Label>
        </Field.LegendHeader>
      </Field.Legend>
      <Field.Group className="grid grid-cols-1 gap-large sm:grid-cols-2">
        <Input>
          <Input.Label>From</Input.Label>
          <Input.Control name="from" placeholder="2026-01-01" inputMode="numeric" />
        </Input>
        <Input>
          <Input.Label>By</Input.Label>
          <Input.Control name="to" placeholder="2026-06-30" inputMode="numeric" />
        </Input>
      </Field.Group>
    </Field.Set>
  );
}
