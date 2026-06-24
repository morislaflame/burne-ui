import { Field } from "@/components/core/Field";
import { Input } from "@/components/core/Input";
import { Label } from "@/components/core/Label";
import { Switch } from "@/components/core/Switch";
import { Text } from "@/components/core/Text";

export function FieldSettingsPanelDemo() {
  return (
    <Field.Set className="w-full max-w-md divide-y divide-token rounded-mid border-token">
      <div className="flex flex-col gap-mid p-mid">
        <Field.Legend>
          <Field.LegendHeader>
            <Label>Уведомления</Label>
            <Field.Hint as="span">Email и push</Field.Hint>
          </Field.LegendHeader>
        </Field.Legend>
        <div className="flex items-center justify-between gap-mid">
          <Text as="span" variant="small">
            Еженедельный дайджест
          </Text>
          <Switch defaultChecked aria-label="Еженедельный дайджест" />
        </div>
      </div>
      <Field.Group className="p-mid">
        <Input>
          <Input.Label>Email для отчётов</Input.Label>
          <Input.Control name="reportsEmail" placeholder="team@company.com" autoComplete="email" />
        </Input>
      </Field.Group>
    </Field.Set>
  );
}
