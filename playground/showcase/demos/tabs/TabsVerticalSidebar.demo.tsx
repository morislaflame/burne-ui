import { useState } from "react";

import { Tabs } from "@/components/core/Tabs";
import { Text } from "@/components/core/Text";

export function TabsVerticalSidebarDemo() {
  const [tab, setTab] = useState("profile");

  return (
    <Tabs
      orientation="vertical"
      variant="outline"
      value={tab}
      onValueChange={setTab}
      className="w-full max-w-md"
    >
      <Tabs.List>
        <Tabs.Tab value="profile">Profile</Tabs.Tab>
        <Tabs.Tab value="team">Team</Tabs.Tab>
        <Tabs.Tab value="api">API-keys</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="profile">
        <Text as="p" variant="small" className="text-muted">
          orientation=&quot;vertical&quot; — side navigation.
        </Text>
      </Tabs.Panel>
      <Tabs.Panel value="team">
        <Text as="p" variant="small" className="text-muted">
          Participants and roles.
        </Text>
      </Tabs.Panel>
      <Tabs.Panel value="api">
        <Text as="p" variant="small" className="text-muted">
          Key creation and revocation.
        </Text>
      </Tabs.Panel>
    </Tabs>
  );
}
