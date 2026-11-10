import { useState } from "react";

import { Slider } from "@/components/core/Slider";

export function SliderVariantsDemo() {
  const [value, setValue] = useState(40);

  return (
    <div className="flex flex-wrap items-end justify-center gap-2xlarge">
      <Slider label="Disabled" value={30} min={0} max={100} disabled className="w-64" />
      <Slider
        orientation="vertical"
        label="Vertical"
        className="h-32"
        value={value}
        onValueChange={setValue}
        min={0}
        max={100}
      />
    </div>
  );
}
