import { useState } from "react";

import { ColorSlider, ColorSwatch, type HSVA } from "@/components/core/ColorPicker";
import { hsvaToHex } from "@/components/core/ColorPicker/colorUtils";
import { Text } from "@/components/core/Text";

export function ColorSlidersDemo() {
  const [hsva, setHsva] = useState<HSVA>({ h: 220, s: 80, v: 90, a: 100 });

  return (
    <div className="flex max-w-sm flex-col gap-large">
      <ColorSlider
        channel="hue"
        color={hsva}
        label="Hue (Hue)"
        value={hsva.h}
        onValueChange={(h) => setHsva({ ...hsva, h })}
        classNames={{
          root: "gap-small",
          label: "text-primary",
          value: "font-mono",
          track: "rounded-full",
          thumb: "ring-2 ring-primary/40",
        }}
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
        <Text as="span" textStyle="small" className="font-mono text-muted">
          {hsvaToHex(hsva)}
        </Text>
      </div>
    </div>
  );
}
