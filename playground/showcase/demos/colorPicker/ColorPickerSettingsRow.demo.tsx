import { useState } from "react";

import { ColorPicker } from "@/components/core/ColorPicker";
import { Surface } from "@/components/core/Surface";
import { Text } from "@/components/core/Text";

export function ColorPickerSettingsRowDemo() {
  const [accent, setAccent] = useState("#7c3aed");

  return (
    <Surface variant="secondary" padding="mid" className="w-full max-w-md">
      <div className="flex items-center justify-between gap-mid">
        <div className="flex min-w-0 flex-col gap-xsmall">
          <Text as="span" variant="small" className="font-medium">
            Accent color
          </Text>
          <Text as="span" variant="xsmall" className="font-mono text-muted">
            {accent}
          </Text>
        </div>
        <ColorPicker value={accent} onValueChange={setAccent} size="small">
          <ColorPicker.Trigger />
          <ColorPicker.Content presets={["#7c3aed", "#3b82f6", "#22c55e", "#ef4444"]} />
        </ColorPicker>
      </div>
    </Surface>
  );
}
