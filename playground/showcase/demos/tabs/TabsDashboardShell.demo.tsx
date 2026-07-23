import { Badge } from "@/components/core/Badge";
import { Surface } from "@/components/core/Surface";
import { Tabs } from "@/components/core/Tabs";
import { Text } from "@/components/core/Text";

export function TabsDashboardShellDemo() {
  return (
    <Surface padding="large" className="flex w-full max-w-lg flex-col gap-large">
      <div className="flex items-center justify-between gap-large">
        <Text as="p" variant="base" className="font-medium">
          Analytics
        </Text>
        <Badge variant="outline" size="small">
          Live
        </Badge>
      </div>
      <Tabs defaultValue="traffic" variant="outline">
        <Tabs.List className="border-none p-0">
          <Tabs.Tab value="traffic">Traffic</Tabs.Tab>
          <Tabs.Tab value="conversion">Conversion</Tabs.Tab>
          <Tabs.Tab value="retention">Hold</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="traffic" className="pt-large">
          <div className="flex h-24 items-center justify-center rounded-base border border-dashed border-token text-muted">
            <Text as="span" variant="xsmall">
              Visiting schedule
            </Text>
          </div>
        </Tabs.Panel>
        <Tabs.Panel value="conversion" className="pt-large">
          <Text as="p" variant="xsmall" className="text-muted">
            Funnel and goals.
          </Text>
        </Tabs.Panel>
        <Tabs.Panel value="retention" className="pt-large">
          <Text as="p" variant="xsmall" className="text-muted">
            Cohorts in 30 days.
          </Text>
        </Tabs.Panel>
      </Tabs>
    </Surface>
  );
}
