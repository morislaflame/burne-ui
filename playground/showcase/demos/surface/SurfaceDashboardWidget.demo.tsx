import { Badge } from "@/components/core/Badge";
import { Button } from "@/components/core/Button";
import { Surface } from "@/components/core/Surface";
import { Text } from "@/components/core/Text";

export function SurfaceDashboardWidgetDemo() {
  return (
    <Surface variant="secondary" padding="mid" shadow="md" className="flex w-full max-w-sm flex-col gap-mid">
      <div className="flex items-start justify-between gap-mid">
        <div className="flex flex-col gap-xsmall">
          <Text as="p" variant="base" className="font-medium">
            Деплои
          </Text>
          <Text as="p" variant="tools" className="text-muted">
            Последние 24 часа
          </Text>
        </div>
        <Badge status="success" size="small">
          Healthy
        </Badge>
      </div>
      <Text as="p" variant="large" className="font-semibold">
        14
      </Text>
      <div className="flex justify-end">
        <Button variant="ghost" size="small" type="button">
          Подробнее
        </Button>
      </div>
    </Surface>
  );
}
