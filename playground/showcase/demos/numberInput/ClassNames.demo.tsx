import { NumberInput } from "@/components/core/NumberInput";

export function NumberInputClassNamesDemo() {
  return (
    <NumberInput
      label="Quantity"
      defaultValue={3}
      classNames={{
        shell: "bg-primary-tint",
        control: "font-w-mid",
      }}
    />
  );
}
