import { NumberInput } from "@/components/core/NumberInput";

export function NumberInputBoundsDemo() {
  return <NumberInput label="Seats" min={0} max={8} defaultValue={2} />;
}
