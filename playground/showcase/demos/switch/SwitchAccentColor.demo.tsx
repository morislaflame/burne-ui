import { useState } from "react";

import { Switch } from "@/components/core/Switch";
import { Text } from "@/components/core/Text";

export function SwitchAccentColorDemo() {
  const [enabled, setEnabled] = useState(true);

  return (
    <div className="flex w-full max-w-sm flex-col gap-mid">
      <Text as="p" variant="small" className="font-medium">
        Акцентный цвет
      </Text>
      <Switch
        checked={enabled}
        onChange={(e) => setEnabled(e.target.checked)}
        label="Градиентная заливка"
        hint="color — CSS-цвет или linear-gradient"
        color="linear-gradient(90deg, var(--color-success) 0%, var(--color-primary) 100%)"
      />
    </div>
  );
}
