import { useState } from "react";

import { ColorPicker, ColorSwatch } from "@/components/core/ColorPicker";
import { Text } from "@/components/core/Text";

export function ColorPickerBasicDemo() {
  const [color, setColor] = useState("#3b82f6");

  return (
    <div className="flex flex-wrap items-center gap-large">
      <ColorPicker value={color} onValueChange={setColor}>
        <ColorPicker.Trigger />
        <ColorPicker.Content />
      </ColorPicker>
      <ColorSwatch color={color} size="large" />
      <Text as="span" variant="small" className="font-mono text-muted">
        {color}
      </Text>
    </div>
  );
}
