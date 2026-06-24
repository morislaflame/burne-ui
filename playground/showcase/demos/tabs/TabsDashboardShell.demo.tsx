import { Badge } from "@/components/core/Badge";
import { Surface } from "@/components/core/Surface";
import { Tabs } from "@/components/core/Tabs";
import { Text } from "@/components/core/Text";

export function TabsDashboardShellDemo() {
  return (
    <Surface variant="secondary" padding="mid" className="flex w-full max-w-lg flex-col gap-mid">
      <div className="flex items-center justify-between gap-mid">
        <Text as="p" variant="small" className="font-medium">
          Аналитика
        </Text>
        <Badge variant="outline" size="small">
          Live
        </Badge>
      </div>
      <Tabs defaultValue="traffic" variant="outline">
        <Tabs.List>
          <Tabs.Tab value="traffic">Трафик</Tabs.Tab>
          <Tabs.Tab value="conversion">Конверсия</Tabs.Tab>
          <Tabs.Tab value="retention">Удержание</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="traffic" className="pt-mid">
          <div className="flex h-24 items-center justify-center rounded-base border border-dashed border-token text-muted">
            <Text as="span" variant="tools">
              График посещений
            </Text>
          </div>
        </Tabs.Panel>
        <Tabs.Panel value="conversion" className="pt-mid">
          <Text as="p" variant="tools" className="text-muted">
            Воронка и цели.
          </Text>
        </Tabs.Panel>
        <Tabs.Panel value="retention" className="pt-mid">
          <Text as="p" variant="tools" className="text-muted">
            Когорты за 30 дней.
          </Text>
        </Tabs.Panel>
      </Tabs>
    </Surface>
  );
}
