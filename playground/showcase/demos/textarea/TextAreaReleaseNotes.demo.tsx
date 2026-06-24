import { useState } from "react";

import { Text } from "@/components/core/Text";
import { TextArea } from "@/components/core/TextArea";

const MAX = 280;

export function TextAreaReleaseNotesDemo() {
  const [value, setValue] = useState("Исправлены отступы в Field.Set и добавлены кастомные демо в showcase.");

  return (
    <div className="flex w-full max-w-md flex-col gap-xsmall rounded-mid border-token bg-tertiary p-mid">
      <TextArea className="w-full">
        <TextArea.Label>Заметки к релизу</TextArea.Label>
        <TextArea.Control
          variant="outline"
          rows={4}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <TextArea.Hint>Кратко опишите изменения для changelog.</TextArea.Hint>
      </TextArea>
      <Text
        as="p"
        variant="tools"
        className={`text-right tabular-nums ${value.length > MAX ? "text-danger" : "text-muted"}`}
      >
        {value.length} / {MAX}
      </Text>
    </div>
  );
}
