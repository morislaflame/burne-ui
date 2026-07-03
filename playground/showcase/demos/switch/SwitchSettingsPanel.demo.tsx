import { useState } from "react";

import { Surface } from "@/components/core/Surface";
import { Switch } from "@/components/core/Switch";
import { Text } from "@/components/core/Text";

export function SwitchSettingsPanelDemo() {
  const [push, setPush] = useState(true);
  const [email, setEmail] = useState(false);
  const [digest, setDigest] = useState(true);

  return (
    <Surface variant="secondary" padding="mid" className="w-full max-w-md flex flex-col gap-mid">
      <Text as="p" variant="base" className="mb-mid font-medium text-muted">
        Notifications
      </Text>
      <ul className="flex flex-col divide-y divide-border">
        <li className="flex items-center justify-between gap-mid py-mid first:pt-0 last:pb-0">
          <div className="flex min-w-0 flex-col gap-xsmall">
            <Text as="span" variant="small" className="font-medium">
              Push
            </Text>
            <Text as="span" variant="tools" className="text-muted">
              Instant notifications on device
            </Text>
          </div>
          <Switch
            checked={push}
            onChange={(e) => setPush(e.target.checked)}
            aria-label="Push-notifications"
          />
        </li>
        <li className="flex items-center justify-between gap-mid py-mid first:pt-0 last:pb-0">
          <div className="flex min-w-0 flex-col gap-xsmall">
            <Text as="span" variant="small" className="font-medium">
              Email
            </Text>
            <Text as="span" variant="tools" className="text-muted">
              Digest once a week
            </Text>
          </div>
          <Switch

            checked={email}
            onChange={(e) => setEmail(e.target.checked)}
            aria-label="Email-notifications"
          />
        </li>
        <li className="flex items-center justify-between gap-mid py-mid first:pt-0 last:pb-0">
          <div className="flex min-w-0 flex-col gap-xsmall">
            <Text as="span" variant="small" className="font-medium">
              Summary
            </Text>
            <Text as="span" variant="tools" className="text-muted">
              Brief activity report
            </Text>
          </div>
          <Switch
            checked={digest}
            onChange={(e) => setDigest(e.target.checked)}
            aria-label="Activity Summary"
          />
        </li>
      </ul>
    </Surface>
  );
}
