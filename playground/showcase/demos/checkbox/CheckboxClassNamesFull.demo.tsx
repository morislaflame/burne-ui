import { Checkbox } from "@/components/core/Checkbox";

export function CheckboxClassNamesFullDemo() {
  return (
    <Checkbox
      defaultChecked
      variant="outline"
      classNames={{
        root: "rounded-large border-info/40 p-large shadow-token-base",
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
        <Checkbox.Label>Notifications</Checkbox.Label>
        <Checkbox.Hint>Setting up slots via classNames on root.</Checkbox.Hint>
      </Checkbox.Content>
    </Checkbox>
  );
}
