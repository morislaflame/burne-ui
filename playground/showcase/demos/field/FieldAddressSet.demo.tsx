import { Field } from "@/components/core/Field";
import { Input } from "@/components/core/Input";
import { Label } from "@/components/core/Label";

export function FieldAddressSetDemo() {
  return (
    <Field.Set className="max-w-md">
      <Field.Legend>
        <Field.LegendHeader>
          <Label>Адрес доставки</Label>
          <Field.Hint as="span">Укажите актуальный адрес</Field.Hint>
        </Field.LegendHeader>
      </Field.Legend>
      <Field.Group>
        <Input>
          <Input.Label>Город</Input.Label>
          <Input.Control placeholder="Москва" />
        </Input>
      </Field.Group>
    </Field.Set>
  );
}
