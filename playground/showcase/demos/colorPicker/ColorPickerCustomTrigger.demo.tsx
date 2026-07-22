import { useState } from "react";

import { ColorPicker } from "@/components/core/ColorPicker";

/** Custom opener: chip + hex + label via Trigger asChild. */
export function ColorPickerCustomTriggerDemo() {
  const [color, setColor] = useState("#8b5cf6");

  return (
    <div className="flex flex-col items-center gap-mid">
      <ColorPicker value={color} onValueChange={setColor}>
        <ColorPicker.Trigger asChild>
          <button
            type="button"
            className="inline-flex items-center gap-small rounded-base border-token bg-surface px-mid py-small text-small font-medium shadow-token-base"
          >
            <span
              aria-hidden
              className="h-5 w-5 shrink-0 rounded-full border-token"
              style={{ backgroundColor: color }}
            />
            <span className="font-mono text-muted">{color}</span>
            <span>Change</span>
          </button>
        </ColorPicker.Trigger>
        <ColorPicker.Content showAlpha />
      </ColorPicker>
    </div>
  );
}
