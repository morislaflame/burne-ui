import { useState } from "react";

import { Tabs } from "@/components/core/Tabs";
import { Text } from "@/components/core/Text";

export function TabsGlossDemo() {
  const [glossTab, setGlossTab] = useState("overview");

  return (
    <Tabs variant="gloss" value={glossTab} onValueChange={setGlossTab} className="w-full justify-center items-center">
      <Tabs.List>
        <Tabs.Tab value="overview">Review</Tabs.Tab>
        <Tabs.Tab value="details">Details</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="overview" className="pt-mid">
        <Text as="p" variant="small" className="text-muted">
          Gloss Tabs — glass tab list with indicator.
        </Text>
      </Tabs.Panel>
      <Tabs.Panel value="details" className="pt-mid">
        <Text as="p" variant="small" className="text-muted">
          Active tab: {glossTab}
        </Text>
      </Tabs.Panel>
    </Tabs>
  );
}
