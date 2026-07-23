import { Radio } from "@/components/core/Radio";

export function RadioClassNamesFullDemo() {
  return (
    <Radio
      name="classnames-full"
      value="courier"
      defaultChecked
      variant="gloss"
      classNames={{
        root: "rounded-large border-info/40 p-large shadow-token-base",
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
        <Radio.Label>Courier</Radio.Label>
        <Radio.Hint>Setting up slots via classNames on root.</Radio.Hint>
      </Radio.Content>
    </Radio>
  );
}
