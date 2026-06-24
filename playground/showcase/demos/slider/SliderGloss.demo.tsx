import { useState } from "react";

import { Slider } from "@/components/core/Slider";

export function SliderGlossDemo() {
  const [value, setValue] = useState(40);

  return (
    <Slider
      gloss
      label="Gloss slider"
      showValue
      value={value}
      onValueChange={setValue}
      min={0}
      max={100}
      step={1}
      className="w-64"
    />
  );
}
