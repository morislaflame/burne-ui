import { NumberInput } from "@/components/core/NumberInput";

export function NumberInputFormatDemo() {
  return (
    <NumberInput
      label="Amount"
      defaultValue={1200}
      step={100}
      formatOptions={{ useGrouping: true }}
      hint="The committed number is shown with grouping."
    />
  );
}
