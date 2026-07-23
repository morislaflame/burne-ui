import { useState } from "react";
import { IoContrastOutline } from "react-icons/io5";

import { Slider } from "@/components/core/Slider";
import { Text } from "@/components/core/Text";

export function SliderOpacityStripDemo() {
  const [value, setValue] = useState(40);

  return (
    <div className="flex w-full max-w-md flex-col gap-small">
      <Slider>
        <Slider.Track
          gloss
          value={value}
          onValueChange={setValue}
          min={0}
          max={100}
          step={1}
          thickness="1rem"
          ariaLabel="Contrast"
        >
          <Slider.Rail>
            <Slider.Fill className="bg-primary/80" />
          </Slider.Rail>
          <Slider.Thumb>
            <Slider.Icon>
              <IoContrastOutline aria-hidden className="size-full" />
            </Slider.Icon>
          </Slider.Thumb>
        </Slider.Track>
      </Slider>
      <Text as="p" variant="xsmall" className="text-center tabular-nums text-muted">
        Gloss + thickness 1rem · {value}%
      </Text>
    </div>
  );
}
