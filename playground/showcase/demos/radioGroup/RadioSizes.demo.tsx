import { Radio } from "@/components/core/Radio";

export function RadioSizesDemo() {
  return (
    <div className="flex flex-wrap items-center gap-mid">
      <Radio size="small" name="radio-size-demo" value="small" label="Small" defaultChecked />
      <Radio size="base" name="radio-size-demo" value="base" label="Base" />
      <Radio size="mid" name="radio-size-demo" value="mid" label="Mid" />
      <Radio size="large" name="radio-size-demo" value="large" label="Large" />
    </div>
  );
}
