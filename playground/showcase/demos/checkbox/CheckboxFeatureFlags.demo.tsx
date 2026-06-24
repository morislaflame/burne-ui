import { useState } from "react";
import { IoShieldCheckmark } from "react-icons/io5";

import { Checkbox } from "@/components/core/Checkbox";

export function CheckboxFeatureFlagsDemo() {
  const [enabled, setEnabled] = useState(true);

  return (
    <Checkbox variant="outline" checked={enabled} onChange={(e) => setEnabled(e.target.checked)}>
      <Checkbox.Control>
        <Checkbox.Indicator className="rounded-mid">
          <IoShieldCheckmark aria-hidden className="size-full text-primary" />
        </Checkbox.Indicator>
      </Checkbox.Control>
      <Checkbox.Content>
        <Checkbox.Label>Двухфакторная аутентификация</Checkbox.Label>
        <Checkbox.Hint>Квадратный индикатор через className=&quot;rounded-mid&quot;.</Checkbox.Hint>
      </Checkbox.Content>
    </Checkbox>
  );
}
