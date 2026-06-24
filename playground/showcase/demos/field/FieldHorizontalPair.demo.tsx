import { Field } from "@/components/core/Field";
import { Input } from "@/components/core/Input";
import { Label } from "@/components/core/Label";

export function FieldHorizontalPairDemo() {
  return (
    <Field.Set className="w-full max-w-lg">
      <Field.Legend>
        <Field.LegendHeader>
          <Label>Период отчёта</Label>
        </Field.LegendHeader>
      </Field.Legend>
      <Field.Group className="grid grid-cols-1 gap-mid sm:grid-cols-2">
        <Input>
          <Input.Label>С</Input.Label>
          <Input.Control name="from" placeholder="2026-01-01" inputMode="numeric" />
        </Input>
        <Input>
          <Input.Label>По</Input.Label>
          <Input.Control name="to" placeholder="2026-06-30" inputMode="numeric" />
        </Input>
      </Field.Group>
    </Field.Set>
  );
}
