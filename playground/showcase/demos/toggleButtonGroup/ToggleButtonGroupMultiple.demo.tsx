import { useState } from "react";

import { ToggleButtonGroup } from "@/components/composite/ToggleButtonGroup";
import { ToggleButton } from "@/components/core/ToggleButton";

export function ToggleButtonGroupMultipleDemo() {
  const [formats, setFormats] = useState<string[]>(["bold"]);

  return (
    <ToggleButtonGroup
      type="multiple"
      aria-label="Formatting"
      value={formats}
      onValueChange={(v) => setFormats(v as string[])}
    >
      <ToggleButton value="bold">Fatty</ToggleButton>
      <ToggleButton value="italic">Italics</ToggleButton>
      <ToggleButton value="underline">Underlined</ToggleButton>
    </ToggleButtonGroup>
  );
}
