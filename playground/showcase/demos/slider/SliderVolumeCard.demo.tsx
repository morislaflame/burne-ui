import { useState } from "react";
import { IoVolumeHigh } from "react-icons/io5";

import { Slider } from "@/components/core/Slider";

export function SliderVolumeCardDemo() {
  const [value, setValue] = useState(50);

  return (
    <Slider className="w-full max-w-sm">
      <Slider.Header>
        <Slider.Label>Volume</Slider.Label>
        <Slider.Value />
      </Slider.Header>
      <Slider.Track
        value={value}
        onValueChange={setValue}
        min={0}
        max={100}
        step={1}
        thumbClassName="rounded-large"
      >
        <Slider.Rail className="rounded-large">
          <Slider.Fill className="rounded-large" />
        </Slider.Rail>
        <Slider.Thumb>
          <Slider.Icon>
            <IoVolumeHigh aria-hidden className="size-full" />
          </Slider.Icon>
        </Slider.Thumb>
      </Slider.Track>
      <Slider.Hint>Compound Track + thumbClassName=&quot;rounded-large&quot;.</Slider.Hint>
    </Slider>
  );
}
