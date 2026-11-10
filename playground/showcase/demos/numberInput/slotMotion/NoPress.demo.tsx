import { NumberInput } from "@/components/core/NumberInput";

export function NumberInputMotionNoPressDemo() {
  return (
    <NumberInput
      label="Quantity"
      defaultValue={1}
      motion={{
        decrement: { pressIn: false },
        increment: { pressIn: false },
      }}
    />
  );
}
