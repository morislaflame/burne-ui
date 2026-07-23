import { Field } from "@/components/core/Field";
import { Label } from "@/components/core/Label";
import { Switch } from "@/components/core/Switch";

export function FieldSettingsPanelDemo() {
  return (
    <Field.Set className="w-full max-w-md">
      <div className="flex flex-col gap-large p-large">
        <Field.Legend>
          <Field.LegendHeader>
            <Label>Notifications</Label>
            <Field.Hint as="span">Email and push</Field.Hint>
          </Field.LegendHeader>
        </Field.Legend>
        <div className="flex items-center justify-between gap-large">
          <Switch defaultChecked aria-label="Weekly digest" >
            <Switch.Control defaultChecked />
            <Switch.Content>
              <Switch.Label>Weekly digest</Switch.Label>
            </Switch.Content>
          </Switch>
        </div>
      </div>
    </Field.Set>
  );
}
