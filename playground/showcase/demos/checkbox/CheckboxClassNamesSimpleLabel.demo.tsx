import { Checkbox } from "@/components/core/Checkbox";

export function CheckboxClassNamesSimpleLabelDemo() {
  return (
    <Checkbox
      defaultChecked
      label="Email-рассылка"
      hint="classNames.label и labelText работают в simple API."
      classNames={{
        label: "text-primary",
        labelText: "font-semibold underline decoration-primary/30 underline-offset-4",
        hint: "text-muted/80",
      }}
      className="max-w-md"
    />
  );
}
