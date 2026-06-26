import { Button } from "@/components/core/Button";
import { Field } from "@/components/core/Field";
import { Input } from "@/components/core/Input";
import { Label } from "@/components/core/Label";
import { Text } from "@/components/core/Text";

export function FieldBillingSetDemo() {
  return (
    <Field.Set className="w-full max-w-md">
      <Field.Legend>
        <Field.LegendHeader>
          <Label>Оплата</Label>
          <Field.Hint as="span">Данные защищены</Field.Hint>
        </Field.LegendHeader>
      </Field.Legend>
      <Field.Group>
        <Input>
          <Input.Label>Имя на карте</Input.Label>
          <Input.Control placeholder="IVAN IVANOV" autoComplete="cc-name" />
        </Input>
        <Input>
          <Input.Label>Номер карты</Input.Label>
          <Input.Control placeholder="•••• •••• •••• 4242" inputMode="numeric" />
          <Input.Hint>Списание произойдёт после подтверждения.</Input.Hint>
        </Input>
      </Field.Group>
      <Field.Actions>
        <Button type="button" variant="primary" size="small">
          Оплатить
        </Button>
      </Field.Actions>
    </Field.Set>
  );
}
