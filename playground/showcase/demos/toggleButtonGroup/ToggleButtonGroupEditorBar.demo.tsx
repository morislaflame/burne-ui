import { useState } from "react";

import { ToggleButtonGroup } from "@/components/composite/ToggleButtonGroup";
import { Surface } from "@/components/core/Surface";
import { ToggleButton } from "@/components/core/ToggleButton";
import { Text } from "@/components/core/Text";

export function ToggleButtonGroupEditorBarDemo() {
  const [formats, setFormats] = useState<string[]>(["bold", "italic"]);

  return (
    <Surface variant="secondary" padding="small" className="w-full max-w-md">
      <div className="flex flex-col gap-small">
        <Text as="span" variant="xsmall" className="text-muted">
          Format panel
        </Text>
        <ToggleButtonGroup
          type="multiple"
          size="small"
          variant="outline"
          aria-label="Formatting text"
          value={formats}
          onValueChange={(v) => setFormats(v as string[])}
        >
          <ToggleButton value="bold">B</ToggleButton>
          <ToggleButton value="italic">I</ToggleButton>
          <ToggleButton value="underline">U</ToggleButton>
          <ToggleButton value="strike">S</ToggleButton>
        </ToggleButtonGroup>
      </div>
    </Surface>
  );
}
