import { Tabs } from "@/components/core/Tabs";
import { Text } from "@/components/core/Text";

export function TabsOutlineDemo() {
  return (
    <Tabs defaultValue="a" variant="outline">
      <Tabs.List>
        <Tabs.Tab value="a">Outline A</Tabs.Tab>
        <Tabs.Tab value="b">Outline B</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="a" className="pt-mid">
        <Text as="p" variant="small" className="text-muted">
          variant outline
        </Text>
      </Tabs.Panel>
      <Tabs.Panel value="b" className="pt-mid">
        <Text as="p" variant="small" className="text-muted">
          primary-tint индикатора
        </Text>
      </Tabs.Panel>
    </Tabs>
  );
}
