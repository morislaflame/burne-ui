import { Switch } from "@/components/core/Switch";

export function SwitchClassNamesFullDemo() {
  return (
    <Switch
      defaultChecked
      gloss
      color="var(--color-primary)"
      classNames={{
        root: "max-w-md rounded-mid border border-info/25 p-base",
        track: "ring-1 ring-info/20",
        fill: "opacity-95",
        thumbShell: "ring-info/30",
        labelText: "text-info font-semibold",
        hint: "text-muted/80",
      }}
    >
      <Switch.Control />
      <Switch.Content>
        <Switch.Label>Уведомления</Switch.Label>
        <Switch.Hint>Настройка слотов через classNames на root.</Switch.Hint>
      </Switch.Content>
    </Switch>
  );
}
