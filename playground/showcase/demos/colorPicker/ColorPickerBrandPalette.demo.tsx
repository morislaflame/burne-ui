import { useState } from "react";

import { ColorPicker, ColorSwatch } from "@/components/core/ColorPicker";
import { Surface } from "@/components/core/Surface";
import { Text } from "@/components/core/Text";

const BRAND_PRESETS = ["#3b82f6", "#22c55e", "#ef4444", "#eab308", "#a855f7", "#06b6d4"];

export function ColorPickerBrandPaletteDemo() {
  const [color, setColor] = useState(BRAND_PRESETS[0]);

  return (
    <Surface variant="secondary" padding="large" className="flex w-full max-w-sm flex-col gap-large">
      <Text as="p" variant="small" className="font-medium">
        Brand palette
      </Text>
      <div className="flex items-center gap-large">
        <ColorPicker value={color} onValueChange={setColor}>
          <ColorPicker.Trigger />
          <ColorPicker.Content presets={BRAND_PRESETS} />
        </ColorPicker>
        <ColorSwatch color={color} size="large" />
        <Text as="span" variant="small" className="font-mono text-muted">
          {color}
        </Text>
      </div>
    </Surface>
  );
}
