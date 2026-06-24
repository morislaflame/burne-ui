import { useState } from "react";

import { ToggleButtonGroup } from "@/components/composite/ToggleButtonGroup";
import { ToggleButton } from "@/components/core/ToggleButton";

export function ToggleButtonGroupMultipleDemo() {
  const [formats, setFormats] = useState<string[]>(["bold"]);

  return (
    <ToggleButtonGroup
      type="multiple"
      aria-label="Форматирование"
      value={formats}
      onValueChange={(v) => setFormats(v as string[])}
    >
      <ToggleButton value="bold">Жирный</ToggleButton>
      <ToggleButton value="italic">Курсив</ToggleButton>
      <ToggleButton value="underline">Подчёркнутый</ToggleButton>
    </ToggleButtonGroup>
  );
}
