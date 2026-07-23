import { useState } from "react";

import { Text } from "@/components/core/Text";
import { TextArea } from "@/components/core/TextArea";

const MAX = 280;

export function TextAreaReleaseNotesDemo() {
  const [value, setValue] = useState("Fixed indents in Field.Set and added custom demos to showcase.");

  return (
    <div className="flex w-full max-w-md flex-col gap-xsmall rounded-mid border-token bg-tertiary p-large">
      <TextArea className="w-full">
        <TextArea.Label>Release Notes</TextArea.Label>
        <TextArea.Control
          variant="outline"
          rows={4}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <TextArea.Hint>Briefly describe the changes for changelog.</TextArea.Hint>
      </TextArea>
      <Text
        as="p"
        variant="xsmall"
        className={`text-right tabular-nums ${value.length > MAX ? "text-danger" : "text-muted"}`}
      >
        {value.length} / {MAX}
      </Text>
    </div>
  );
}
