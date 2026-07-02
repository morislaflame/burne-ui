import { Switch } from "@/components/core/Switch";

export function SwitchClassNamesSimpleLabelDemo() {
  return (
    <Switch
      defaultChecked
      label="Push-уведомления"
      hint="classNames.label применяется к ячейке подписи."
      classNames={{
        label: "text-success",
        labelText: "font-semibold underline decoration-success/30 underline-offset-4",
        hint: "text-muted/80",
      }}
      className="max-w-md"
    />
  );
}
