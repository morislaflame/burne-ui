import { useState } from "react";
import { IoVolumeHigh } from "react-icons/io5";

import { Slider } from "@/components/core/Slider";

export function SliderVolumeCardDemo() {
  const [value, setValue] = useState(55);

  return (
    <Slider className="w-full max-w-sm">
      <Slider.Header>
        <Slider.Label>Громкость</Slider.Label>
        <Slider.Value />
      </Slider.Header>
      <Slider.Track
        value={value}
        onValueChange={setValue}
        min={0}
        max={100}
        step={1}
        marks={[0, 50, 100]}
        thumbClassName="rounded-mid"
      >
        <Slider.Rail className="rounded-mid">
          <Slider.Fill className="rounded-mid" />
        </Slider.Rail>
        <Slider.Thumb>
          <Slider.Icon>
            <IoVolumeHigh aria-hidden className="size-full" />
          </Slider.Icon>
        </Slider.Thumb>
      </Slider.Track>
      <Slider.Hint>Compound Track + thumbClassName=&quot;rounded-mid&quot;.</Slider.Hint>
    </Slider>
  );
}
