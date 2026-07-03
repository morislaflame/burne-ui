import { useState } from "react";

import { Slider } from "@/components/core/Slider";

export function SliderBudgetPanelDemo() {
  const [range, setRange] = useState<[number, number]>([25, 75]);

  return (
    <Slider className="w-full max-w-md">
      <Slider.Header>
        <Slider.Label>Brightness Range</Slider.Label>
        <Slider.Value />
      </Slider.Header>
      <Slider.Track
        range
        thickness={12}
        value={range}
        onValueChange={setRange}
        min={0}
        max={100}
        step={5}
      >
        <Slider.Rail className="bg-tertiary">
          <Slider.Fill className="bg-gradient-to-r from-info via-primary to-warning" />
        </Slider.Rail>
        <Slider.Thumb thumb="start" />
        <Slider.Thumb thumb="end" />
      </Slider.Track>
      <Slider.Hint>Thick rail, gradient Fill and two compound-thumb.</Slider.Hint>
    </Slider>
  );
}
