import { useState } from "react";

import { ColorPicker, ColorSwatch } from "@/components/core/ColorPicker";
import { Text } from "@/components/core/Text";

export function ColorPickerBasicDemo() {
  const [color, setColor] = useState("#3b82f6");

  return (
    <div className="flex flex-wrap items-center gap-large">
      <ColorPicker name="brand" value={color} onValueChange={setColor}>
        <ColorPicker.Label>Brand</ColorPicker.Label>
        <ColorPicker.Trigger />
        <ColorPicker.Content />
        <ColorPicker.Hint>Hex</ColorPicker.Hint>
      </ColorPicker>
      <ColorSwatch color={color} size="large" />
      <Text as="span" textStyle="small" className="font-mono text-muted">
        {color}
      </Text>
    </div>
  );
}
