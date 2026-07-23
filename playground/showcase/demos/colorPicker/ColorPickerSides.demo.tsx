import { useState } from "react";

import { ColorPicker } from "@/components/core/ColorPicker";
import { Text } from "@/components/core/Text";

const SIDES = ["top", "right", "bottom", "left"] as const;

export function ColorPickerSidesDemo() {
  const [color, setColor] = useState("#6366f1");

  return (
    <div className="flex flex-wrap items-center gap-mid">
      {SIDES.map((side) => (
        <div key={side} className="flex flex-col items-center gap-small">
          <ColorPicker value={color} onValueChange={setColor} side={side}>
            <ColorPicker.Trigger />
            <ColorPicker.Content />
          </ColorPicker>
          <Text as="span" variant="xsmall" className="text-muted">
            {side}
          </Text>
        </div>
      ))}
    </div>
  );
}
