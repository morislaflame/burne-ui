import { useState } from "react";

import { ToggleButtonGroup } from "@/components/composite/ToggleButtonGroup";
import { ToggleButton } from "@/components/core/ToggleButton";

export function ToggleButtonGroupMultipleDemo() {
  const [formats, setFormats] = useState<string[]>(["bold"]);

  return (
    <ToggleButtonGroup
      selectionMode="multiple"
      aria-label="Formatting"
      values={formats}
      onValuesChange={setFormats}
    >
      <ToggleButton value="bold">Fatty</ToggleButton>
      <ToggleButton value="italic">Italics</ToggleButton>
      <ToggleButton value="underline">Underlined</ToggleButton>
    </ToggleButtonGroup>
  );
}
