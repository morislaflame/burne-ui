import { useState } from "react";

import { Slider } from "@/components/core/Slider";

export function SliderPriceRangeDemo() {
  const [priceRange, setPriceRange] = useState<[number, number]>([200, 750]);

  return (
    <Slider
      range
      label="Цена"
      showValue
      min={0}
      max={1000}
      step={10}
      value={priceRange}
      onValueChange={setPriceRange}
      formatValue={(v) => `${v} ₽`}
      className="w-64"
    />
  );
}
