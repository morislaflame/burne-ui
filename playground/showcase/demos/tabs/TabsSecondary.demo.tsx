import { Tabs } from "@/components/core/Tabs";
import { Text } from "@/components/core/Text";

export function TabsSecondaryDemo() {
  return (
    <Tabs defaultValue="x" variant="secondary">
      <Tabs.List>
        <Tabs.Tab value="x">Secondary X</Tabs.Tab>
        <Tabs.Tab value="y">Secondary Y</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="x" className="pt-mid">
        <Text as="p" variant="small" className="text-muted">
          variant secondary
        </Text>
      </Tabs.Panel>
      <Tabs.Panel value="y" className="pt-mid">
        <Text as="p" variant="small" className="text-muted">
          surface-secondary container
        </Text>
      </Tabs.Panel>
    </Tabs>
  );
}
