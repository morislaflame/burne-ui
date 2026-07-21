import { useState } from "react";

import { ColorSlider, ColorSwatch, hsvaToHex, type HSVA } from "@/components/core/ColorPicker";
import { Text } from "@/components/core/Text";

export function ColorSlidersDemo() {
  const [hsva, setHsva] = useState<HSVA>({ h: 220, s: 80, v: 90, a: 100 });

  return (
    <div className="flex max-w-sm flex-col gap-mid">
      <ColorSlider
        channel="hue"
        color={hsva}
        label="Hue (Hue)"
        value={hsva.h}
        onValueChange={(h) => setHsva({ ...hsva, h })}
      />
      <ColorSlider
        channel="saturation"
        color={hsva}
        label="Saturation"
        value={hsva.s}
        onValueChange={(s) => setHsva({ ...hsva, s })}
      />
      <div className="flex items-center gap-small">
        <ColorSwatch color={hsvaToHex(hsva)} size="large" />
        <Text as="span" variant="small" className="font-mono text-muted">
          {hsvaToHex(hsva)}
        </Text>
      </div>
    </div>
  );
}
