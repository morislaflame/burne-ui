import { Button } from "@/components/core/Button";
import { Field } from "@/components/core/Field";
import { Input } from "@/components/core/Input";
import { Label } from "@/components/core/Label";

export function FieldContactSetDemo() {
  return (
    <Field.Set className="max-w-md">
      <Field.Legend>
        <Field.LegendHeader>
          <Label>Контактные данные</Label>
          <Field.Hint as="span">Все поля обязательны</Field.Hint>
        </Field.LegendHeader>
      </Field.Legend>
      <Field.Group>
        <Input>
          <Input.Label>Телефон</Input.Label>
          <Input.Control placeholder="+7 …" />
        </Input>
        <Input status="danger">
          <Input.Label>Email</Input.Label>
          <Input.Control defaultValue="bad@" />
          <Input.Error>Некорректный адрес.</Input.Error>
        </Input>
      </Field.Group>
      <Field.Actions>
        <Button type="button" size="base">
          Сохранить
        </Button>
        <Button type="button" variant="ghost" size="base">
          Отмена
        </Button>
      </Field.Actions>
    </Field.Set>
  );
}
