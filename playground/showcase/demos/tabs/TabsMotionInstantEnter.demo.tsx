import { Tabs } from "@/components/core/Tabs";
import { Text } from "@/components/core/Text";

export function TabsMotionInstantEnterDemo() {
  return (
    <Tabs
      defaultValue="one"
      motion={{
        tabText: { hoverIn: false, hoverOut: false, pressIn: false, pressOut: false },
        panel: { enter: false },
      }}
    >
      <Tabs.List aria-label="Instant">
        <Tabs.Tab value="one">One</Tabs.Tab>
        <Tabs.Tab value="two">Two</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="one">
        <Text variant="base">Default tab hover skipped</Text>
      </Tabs.Panel>
      <Tabs.Panel value="two">
        <Text variant="base">Second</Text>
      </Tabs.Panel>
    </Tabs>
  );
}
