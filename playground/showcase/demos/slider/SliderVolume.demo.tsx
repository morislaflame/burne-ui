import { useState } from "react";

import { Slider } from "@/components/core/Slider";

export function SliderVolumeDemo() {
  const [value, setValue] = useState(0);

  return (
    <Slider
      label="Volume"
      hint="Hint below the scale"
      showValue
      value={value}
      onValueChange={setValue}
      min={0}
      max={100}
      step={1}
      marks={[0, 25, 50, 75, 100]}
      className="w-64"
    />
  );
}
