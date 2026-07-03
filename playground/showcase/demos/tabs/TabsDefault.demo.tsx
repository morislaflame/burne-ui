import { useState } from "react";

import { Tabs } from "@/components/core/Tabs";
import { Text } from "@/components/core/Text";

export function TabsDefaultDemo() {
  const [tab, setTab] = useState("overview");

  return (
    <Tabs value={tab} onValueChange={setTab}>
      <Tabs.List>
        <Tabs.Tab value="overview">Review</Tabs.Tab>
        <Tabs.Tab value="details">Details</Tabs.Tab>
        <Tabs.Tab value="disabled" disabled>
          Soon
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="overview" className="pt-mid">
        <Text as="p" variant="small" className="text-muted">
          Active tab: {tab} (variant default)
        </Text>
      </Tabs.Panel>
      <Tabs.Panel value="details" className="pt-mid">
        <Text as="p" variant="small">
          Second panel with other content.
        </Text>
      </Tabs.Panel>
    </Tabs>
  );
}
