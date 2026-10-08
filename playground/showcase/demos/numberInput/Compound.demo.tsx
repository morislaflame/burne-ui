import { NumberInput } from "@/components/core/NumberInput";

export function NumberInputCompoundDemo() {
  return (
    <NumberInput min={0} defaultValue={1}>
      <NumberInput.Label>Quantity</NumberInput.Label>
      <NumberInput.Increment />
      <NumberInput.Control />
      <NumberInput.Decrement />
      <NumberInput.Hint>Plus on the start side</NumberInput.Hint>
    </NumberInput>
  );
}
