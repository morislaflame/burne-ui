import { useState } from "react";

import { Surface } from "@/components/core/Surface";
import { Tabs } from "@/components/core/Tabs";
import { Text } from "@/components/core/Text";

export function TabsSettingsPanelDemo() {
  const [tab, setTab] = useState("general");

  return (
    <Surface variant="secondary" padding="mid" className="w-full max-w-md">
      <Tabs variant="secondary" value={tab} onValueChange={setTab}>
        <Tabs.List>
          <Tabs.Tab value="general">Общие</Tabs.Tab>
          <Tabs.Tab value="security">Безопасность</Tabs.Tab>
          <Tabs.Tab value="billing">Оплата</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="general" className="pt-mid">
          <Text as="p" variant="small" className="text-muted">
            Язык, часовой пояс и уведомления.
          </Text>
        </Tabs.Panel>
        <Tabs.Panel value="security" className="pt-mid">
          <Text as="p" variant="small" className="text-muted">
            Пароль, 2FA и активные сессии.
          </Text>
        </Tabs.Panel>
        <Tabs.Panel value="billing" className="pt-mid">
          <Text as="p" variant="small" className="text-muted">
            Тариф, способ оплаты и счета.
          </Text>
        </Tabs.Panel>
      </Tabs>
    </Surface>
  );
}
