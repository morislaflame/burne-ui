import { Input } from "@/components/core/Input";

export function InputSizesDemo() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-small">
      <Input size="small" label="Small" placeholder="Small" />
      <Input size="base" label="Base" placeholder="Base" />
      <Input size="mid" label="Mid" placeholder="Mid" />
      <Input size="large" label="Large" placeholder="Large" />
    </div>
  );
}
