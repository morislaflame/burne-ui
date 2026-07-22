import { useState } from "react";

import { ColorPicker, ColorSwatch } from "@/components/core/ColorPicker";
import { Text } from "@/components/core/Text";

export function ColorPickerCompoundContentDemo() {
  const [color, setColor] = useState("#22c55e");

  return (
    <div className="flex flex-col items-center gap-mid">
      <ColorPicker value={color} onValueChange={setColor}>
        <ColorPicker.Trigger />
        <ColorPicker.Content>
          <ColorPicker.Area />
          <ColorPicker.HexInput />
          <ColorPicker.Presets
            presets={["#22c55e", "#3b82f6", "#f59e0b", "#ef4444"]}
          />
        </ColorPicker.Content>
      </ColorPicker>
      <Text as="p" variant="small" className="font-mono text-muted">
        {color}
      </Text>
    </div>
  );
}
