import { NumberInput } from "@/components/core/NumberInput";

export function NumberInputSizesDemo() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-small">
      <NumberInput size="small" label="Small" min={0} defaultValue={1} />
      <NumberInput size="base" label="Base" min={0} defaultValue={1} />
      <NumberInput size="mid" label="Mid" min={0} defaultValue={1} />
      <NumberInput size="large" label="Large" min={0} defaultValue={1} />
    </div>
  );
}
