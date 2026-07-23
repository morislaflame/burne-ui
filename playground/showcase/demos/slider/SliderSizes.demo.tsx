import { Slider } from "@/components/core/Slider";

export function SliderSizesDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-large">
      <Slider size="small" label="Small" defaultValue={40} className="w-full" />
      <Slider size="base" label="Base" defaultValue={40} className="w-full" />
      <Slider size="mid" label="Mid" defaultValue={40} className="w-full" />
      <Slider size="large" label="Large" defaultValue={40} className="w-full" />
    </div>
  );
}
