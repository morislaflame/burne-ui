import { Surface } from "@/components/core/Surface";
import { Text } from "@/components/core/Text";

export function SurfaceNestedPanelsDemo() {
  return (
    <Surface variant="default" padding="plus" shadow="sm" className="w-full max-w-md">
      <Text as="p" variant="small" className="mb-mid font-medium">
        Панель проекта
      </Text>
      <Surface variant="secondary" padding="base" radius="base">
        <Text as="p" variant="tools" className="text-muted">
          Вложенная secondary-поверхность для секции настроек.
        </Text>
        <Surface variant="tertiary" padding="small" radius="base" className="mt-small">
          <Text as="span" variant="tools">
            tertiary — детали внутри секции
          </Text>
        </Surface>
      </Surface>
    </Surface>
  );
}
