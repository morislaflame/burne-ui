import { useState } from "react";

import { Switch } from "@/components/core/Switch";

export function SwitchNotificationsDemo() {
  const [enabled, setEnabled] = useState(true);

  return (
    <Switch
      checked={enabled}
      onChange={(e) => setEnabled(e.target.checked)}
      label="Notifications"
    />
  );
}
