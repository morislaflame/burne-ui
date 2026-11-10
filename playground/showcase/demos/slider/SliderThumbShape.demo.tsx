import { useState } from "react";

import { Slider } from "@/components/core/Slider";
import { Text } from "@/components/core/Text";

export function SliderThumbShapeDemo() {
  const [round, setRound] = useState(35);
  const [square, setSquare] = useState(70);

  return (
    <div className="flex w-full max-w-md flex-col gap-large">
      <Text as="p" textStyle="small" className="font-medium">
        Form thumb
      </Text>
      <Slider
        label="Round thumb (default)"
        showValue
        value={round}
        onValueChange={setRound}
        className="w-full"
      />
      <Slider className="w-full" classNames={{ thumbShell: "rounded-large" }}>
        <Slider.Header>
          <Slider.Label>rounded-large thumb</Slider.Label>
          <Slider.Value />
        </Slider.Header>
        <Slider.Track
          value={square}
          onValueChange={setSquare}
        >
          <Slider.Rail className="rounded-large">
            <Slider.Fill className="rounded-large" />
          </Slider.Rail>
          <Slider.Thumb />
        </Slider.Track>
        <Slider.Hint>classNames.thumbShell=&quot;rounded-large&quot;</Slider.Hint>
      </Slider>
    </div>
  );
}
