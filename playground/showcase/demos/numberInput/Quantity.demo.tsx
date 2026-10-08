import { NumberInput } from "@/components/core/NumberInput";

export function NumberInputQuantityDemo() {
  return <NumberInput label="Quantity" hint="Whole units" min={0} defaultValue={1} />;
}
