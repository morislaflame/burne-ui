import { Tabs } from "@/components/core/Tabs";
import { Text } from "@/components/core/Text";

function TabsSizeRow({ size }: { size: "small" | "base" | "mid" | "large" }) {
  return (
    <Tabs defaultValue="one" size={size} className="w-full max-w-md">
      <Tabs.List>
        <Tabs.Tab value="one">One</Tabs.Tab>
        <Tabs.Tab value="two">Two</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="one" className="pt-small">
        <Text as="p" variant="small" className="text-muted">
          size={size}
        </Text>
      </Tabs.Panel>
    </Tabs>
  );
}

export function TabsSizesDemo() {
  return (
    <div className="flex w-full flex-col gap-mid">
      <TabsSizeRow size="small" />
      <TabsSizeRow size="base" />
      <TabsSizeRow size="mid" />
      <TabsSizeRow size="large" />
    </div>
  );
}
