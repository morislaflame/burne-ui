import { Radio } from "@/components/core/Radio";

export function RadioClassNamesSimpleLabelDemo() {
  return (
    <Radio
      name="simple-label"
      value="express"
      defaultChecked
      label="Express delivery"
      hint="Slot label stylizes the signature in simple API."
      classNames={{
        label: "text-info",
        labelText: "font-semibold underline decoration-info/30 underline-offset-4",
        hint: "text-muted/80",
      }}
      className="max-w-md"
    />
  );
}
