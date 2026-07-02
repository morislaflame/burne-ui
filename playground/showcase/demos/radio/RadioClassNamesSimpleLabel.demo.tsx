import { Radio } from "@/components/core/Radio";

export function RadioClassNamesSimpleLabelDemo() {
  return (
    <Radio
      name="simple-label"
      value="express"
      defaultChecked
      label="Экспресс-доставка"
      hint="Слот label стилизует подпись в simple API."
      classNames={{
        label: "text-info",
        labelText: "font-semibold underline decoration-info/30 underline-offset-4",
        hint: "text-muted/80",
      }}
      className="max-w-md"
    />
  );
}
