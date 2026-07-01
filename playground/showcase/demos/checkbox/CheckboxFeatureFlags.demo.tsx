import { useState } from "react";

import { Checkbox } from "@/components/core/Checkbox";

export function CheckboxFeatureFlagsDemo() {
  const [enabled, setEnabled] = useState(true);

  return (
    <Checkbox variant="outline" checked={enabled} onChange={(e) => setEnabled(e.target.checked)}>
      <Checkbox.Control>
        <Checkbox.Indicator
          classNames={{
            shell: "rounded-mid",
            fill: "rounded-mid",
          }}
        />
      </Checkbox.Control>
      <Checkbox.Content>
        <Checkbox.Label>Двухфакторная аутентификация</Checkbox.Label>
        <Checkbox.Hint>Форма через classNames.indicator + indicatorFill на root.</Checkbox.Hint>
      </Checkbox.Content>
    </Checkbox>
  );
}
