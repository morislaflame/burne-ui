import { useState } from "react";

import { ColorPicker } from "@/components/core/ColorPicker";
import { Text } from "@/components/core/Text";

export function ColorPickerClassNamesFullDemo() {
  const [color, setColor] = useState("#3b82f6");

  return (
    <div className="flex flex-col items-center gap-large">
      <ColorPicker
        value={color}
        onValueChange={setColor}
        classNames={{
          contentPanel: "border border-info/30 bg-info/5 shadow-token-base",
          area: "rounded-base ring-1 ring-info/25",
          hexInput: "border-info/30 bg-info/10",
          hexInputField: "text-info",
          previewSwatch: "ring-2 ring-info/30",
          slidersStack: "gap-large",
        }}
      >
        <ColorPicker.Trigger />
        <ColorPicker.Content />
      </ColorPicker>
      <Text as="p" variant="small" className="font-mono text-muted">
        {color}
      </Text>
    </div>
  );
}
