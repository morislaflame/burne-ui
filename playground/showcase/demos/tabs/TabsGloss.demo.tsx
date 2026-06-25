import { useState } from "react";

import { Tabs } from "@/components/core/Tabs";
import { Text } from "@/components/core/Text";

export function TabsGlossDemo() {
  const [glossTab, setGlossTab] = useState("overview");

  return (
    <Tabs variant="gloss" value={glossTab} onValueChange={setGlossTab} className="w-full justify-center items-center">
      <Tabs.List>
        <Tabs.Tab value="overview">Обзор</Tabs.Tab>
        <Tabs.Tab value="details">Детали</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="overview" className="pt-mid">
        <Text as="p" variant="small" className="text-muted">
          Gloss Tabs — стеклянный список вкладок с индикатором.
        </Text>
      </Tabs.Panel>
      <Tabs.Panel value="details" className="pt-mid">
        <Text as="p" variant="small" className="text-muted">
          Активная вкладка: {glossTab}
        </Text>
      </Tabs.Panel>
    </Tabs>
  );
}
