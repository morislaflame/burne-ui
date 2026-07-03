import { useState } from "react";

import { Switch } from "@/components/core/Switch";
import { Text } from "@/components/core/Text";

export function SwitchAccentColorDemo() {
  const [enabled, setEnabled] = useState(true);

  return (
    <div className="flex w-full max-w-sm flex-col gap-mid">
      <Text as="p" variant="small" className="font-medium">
        Accent color
      </Text>
      <Switch
        checked={enabled}
        onChange={(e) => setEnabled(e.target.checked)}
        label="Gradient fill"
        hint="color — CSS-color or linear-gradient"
        color="linear-gradient(90deg, var(--color-success) 0%, var(--color-primary) 100%)"
      />
    </div>
  );
}
