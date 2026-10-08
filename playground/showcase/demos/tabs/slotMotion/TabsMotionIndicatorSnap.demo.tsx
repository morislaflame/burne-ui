import { Tabs } from "@/components/core/Tabs";
import { Text } from "@/components/core/Text";

export function TabsMotionIndicatorSnapDemo() {
  return (
    <Tabs defaultValue="one" motion={{ indicator: { change: false } }}>
      <Tabs.List aria-label="Indicator snap">
        <Tabs.Tab value="one">One</Tabs.Tab>
        <Tabs.Tab value="two">Two</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="one">
        <Text variant="base">indicator.change is off — the bar jumps</Text>
      </Tabs.Panel>
      <Tabs.Panel value="two">
        <Text variant="base">Second</Text>
      </Tabs.Panel>
    </Tabs>
  );
}
