import { Checkbox } from "@/components/core/Checkbox";

export function CheckboxClassNamesFullDemo() {
  return (
    <Checkbox
      defaultChecked
      variant="outline"
      classNames={{
        root: "rounded-large border-info/40 p-mid shadow-token-sm",
        control: "ring-info/30",
        controlTrack: "border-info/50",
        indicator: "text-info rounded-mid",
        indicatorFill: "rounded-[inherit]",
        content: "gap-xsmall",
        label: "gap-xsmall",
        labelText: "text-info font-semibold",
        hint: "text-foreground/70",
      }}
      className="max-w-md"
    >
      <Checkbox.Control>
        <Checkbox.Indicator />
      </Checkbox.Control>
      <Checkbox.Content>
        <Checkbox.Label>Уведомления</Checkbox.Label>
        <Checkbox.Hint>Настройка слотов через classNames на root.</Checkbox.Hint>
      </Checkbox.Content>
    </Checkbox>
  );
}
