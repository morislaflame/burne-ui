import { useState } from "react";

import { Surface } from "@/components/core/Surface";
import { Tabs } from "@/components/core/Tabs";
import { Text } from "@/components/core/Text";

export function TabsSettingsPanelDemo() {
  const [tab, setTab] = useState("general");

  return (
    <Surface variant="secondary" padding="large" className="w-full max-w-md">
      <Tabs value={tab} onValueChange={setTab}>
        <Tabs.List>
          <Tabs.Tab value="general">General</Tabs.Tab>
          <Tabs.Tab value="security">Safety</Tabs.Tab>
          <Tabs.Tab value="billing">Payment</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="general" className="pt-large">
          <Text as="p" variant="small" className="text-muted">
            Language, time zone and notifications.
          </Text>
        </Tabs.Panel>
        <Tabs.Panel value="security" className="pt-large">
          <Text as="p" variant="small" className="text-muted">
            Password, 2FA and active sessions.
          </Text>
        </Tabs.Panel>
        <Tabs.Panel value="billing" className="pt-large">
          <Text as="p" variant="small" className="text-muted">
            Tariff, payment method and invoices.
          </Text>
        </Tabs.Panel>
      </Tabs>
    </Surface>
  );
}
