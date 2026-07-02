import { Radio } from "@/components/core/Radio";

export function RadioClassNamesFullDemo() {
  return (
    <Radio
      name="classnames-full"
      value="courier"
      defaultChecked
      variant="gloss"
      classNames={{
        root: "rounded-large border-info/40 p-mid shadow-token-base",
        control: "ring-info/30",
        controlTrack: "border-info/50",
        indicator: "text-info",
        content: "gap-xsmall",
        label: "gap-xsmall",
        labelText: "text-info font-semibold",
        hint: "text-foreground/70",
      }}
      className="max-w-md"
    >
      <Radio.Control>
        <Radio.Indicator />
      </Radio.Control>
      <Radio.Content>
        <Radio.Label>Курьер</Radio.Label>
        <Radio.Hint>Настройка слотов через classNames на root.</Radio.Hint>
      </Radio.Content>
    </Radio>
  );
}
