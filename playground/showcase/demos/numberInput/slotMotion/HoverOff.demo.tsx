import { NumberInput } from "@/components/core/NumberInput";

export function NumberInputMotionHoverOffDemo() {
  return (
    <NumberInput
      label="Quantity"
      defaultValue={1}
      motion={{
        shell: { hoverIn: false, hoverOut: false },
      }}
    />
  );
}
