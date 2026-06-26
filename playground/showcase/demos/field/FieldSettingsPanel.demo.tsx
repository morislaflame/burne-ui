import { Field } from "@/components/core/Field";
import { Input } from "@/components/core/Input";
import { Label } from "@/components/core/Label";
import { Switch } from "@/components/core/Switch";
import { Text } from "@/components/core/Text";

export function FieldSettingsPanelDemo() {
  return (
    <Field.Set className="w-full max-w-md">
      <div className="flex flex-col gap-mid p-mid">
        <Field.Legend>
          <Field.LegendHeader>
            <Label>Уведомления</Label>
            <Field.Hint as="span">Email и push</Field.Hint>
          </Field.LegendHeader>
        </Field.Legend>
        <div className="flex items-center justify-between gap-mid">
          <Switch defaultChecked aria-label="Еженедельный дайджест" >
            <Switch.Control defaultChecked />
            <Switch.Content>
              <Switch.Label>Еженедельный дайджест</Switch.Label>
            </Switch.Content>
          </Switch>
        </div>
      </div>
    </Field.Set>
  );
}
