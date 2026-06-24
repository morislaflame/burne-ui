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
        <Tabs.Tab value="profile">Профиль</Tabs.Tab>
        <Tabs.Tab value="team">Команда</Tabs.Tab>
        <Tabs.Tab value="api">API-ключи</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="profile">
        <Text as="p" variant="small" className="text-muted">
          orientation=&quot;vertical&quot; — боковая навигация.
        </Text>
      </Tabs.Panel>
      <Tabs.Panel value="team">
        <Text as="p" variant="small" className="text-muted">
          Участники и роли.
        </Text>
      </Tabs.Panel>
      <Tabs.Panel value="api">
        <Text as="p" variant="small" className="text-muted">
          Создание и отзыв ключей.
        </Text>
      </Tabs.Panel>
    </Tabs>
  );
}
