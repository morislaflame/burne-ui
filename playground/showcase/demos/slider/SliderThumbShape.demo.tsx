import { useState } from "react";

import { Slider } from "@/components/core/Slider";
import { Text } from "@/components/core/Text";

export function SliderThumbShapeDemo() {
  const [round, setRound] = useState(35);
  const [square, setSquare] = useState(70);

  return (
    <div className="flex w-full max-w-md flex-col gap-mid">
      <Text as="p" variant="small" className="font-medium">
        Форма thumb
      </Text>
      <Slider
        label="Круглый thumb (default)"
        showValue
        value={round}
        onValueChange={setRound}
        className="w-full"
      />
      <Slider className="w-full">
        <Slider.Header>
          <Slider.Label>rounded-mid thumb</Slider.Label>
          <Slider.Value />
        </Slider.Header>
        <Slider.Track
          value={square}
          onValueChange={setSquare}
          thumbClassName="rounded-mid"
        >
          <Slider.Rail className="rounded-mid">
            <Slider.Fill className="rounded-mid" />
          </Slider.Rail>
          <Slider.Thumb />
        </Slider.Track>
        <Slider.Hint>thumbClassName=&quot;rounded-mid&quot;</Slider.Hint>
      </Slider>
    </div>
  );
}
