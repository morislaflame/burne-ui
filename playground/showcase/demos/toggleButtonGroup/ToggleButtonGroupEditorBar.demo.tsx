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
        <Text as="span" variant="tools" className="text-muted">
          Панель форматирования
        </Text>
        <ToggleButtonGroup
          type="multiple"
          size="small"
          variant="outline"
          aria-label="Форматирование текста"
          value={formats}
          onValueChange={(v) => setFormats(v as string[])}
        >
          <ToggleButton value="bold">Ж</ToggleButton>
          <ToggleButton value="italic">К</ToggleButton>
          <ToggleButton value="underline">Ч</ToggleButton>
          <ToggleButton value="strike">З</ToggleButton>
        </ToggleButtonGroup>
      </div>
    </Surface>
  );
}
