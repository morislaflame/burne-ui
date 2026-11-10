import { NumberInput } from "@/components/core/NumberInput";

export function NumberInputDecimalDemo() {
  return <NumberInput label="Amount" min={0} max={5} step={0.5} defaultValue={1} />;
}
