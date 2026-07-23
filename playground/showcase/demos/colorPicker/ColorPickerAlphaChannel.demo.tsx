import { useState } from "react";

import { ColorPicker, ColorSwatch } from "@/components/core/ColorPicker";
import { Text } from "@/components/core/Text";

export function ColorPickerAlphaChannelDemo() {
  const [color, setColor] = useState("#3b82f680");

  return (
    <div className="flex w-full max-w-sm flex-col gap-large">
      <Text as="p" variant="small" className="font-medium">
        Transparency channel
      </Text>
      <div className="flex items-center gap-large">
        <ColorPicker value={color} onValueChange={setColor}>
          <ColorPicker.Trigger />
          <ColorPicker.Content showAlpha />
        </ColorPicker>
        <ColorSwatch color={color} size="large" />
        <Text as="span" variant="small" className="font-mono text-muted">
          {color}
        </Text>
      </div>
    </div>
  );
}
