import { Slider } from "@/components/core/Slider";

export function SliderMotionInstantPressDemo() {
  return (
    <Slider
      className="w-full max-w-sm"
      label="Instant press"
      showValue
      defaultValue={42}
      hint="thumb.pressIn: false"
      motion={{
        thumb: { pressIn: false },
      }}
    />
  );
}
