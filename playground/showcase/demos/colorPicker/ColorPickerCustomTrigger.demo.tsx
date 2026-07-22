import { useState } from "react";

import { ColorPicker, ColorSwatch } from "@/components/core/ColorPicker";
import { Text } from "@/components/core/Text";

export function ColorPickerCustomTriggerDemo() {
  const [color, setColor] = useState("#8b5cf6");

  return (
    <div className="flex flex-col items-center gap-mid">
      <ColorPicker value={color} onValueChange={setColor}>
        <ColorPicker.Trigger asChild>
          <button
            type="button"
            className="inline-flex items-center gap-small rounded-base border-token bg-surface px-mid py-small text-small shadow-token-base"
          >
            <ColorSwatch color={color} size="small" shape="circle" tabIndex={-1} />
            Pick brand color
          </button>
        </ColorPicker.Trigger>
        <ColorPicker.Content showAlpha />
      </ColorPicker>
      <Text as="p" variant="small" className="font-mono text-muted">
        {color}
      </Text>
    </div>
  );
}
