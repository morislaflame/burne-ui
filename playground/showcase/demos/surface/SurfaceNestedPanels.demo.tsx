import { Surface } from "@/components/core/Surface";
import { Text } from "@/components/core/Text";

export function SurfaceNestedPanelsDemo() {
  return (
    <Surface variant="default" padding="plus" shadow="sm" className="w-full max-w-md flex flex-col gap-mid p-mid">
      <Text as="p" variant="small" className="mb-mid font-medium">
        Панель проекта
      </Text>
      <Surface variant="secondary" padding="base" radius="base" className="flex flex-col gap-mid p-mid">
        <Text as="p" variant="small" className="text-secondary-foreground">
          Вложенная secondary-поверхность
        </Text>
        <Surface variant="tertiary" padding="small" radius="base" className="flex p-mid">
          <Text as="span" variant="small">
            tertiary — детали внутри секции
          </Text>
        </Surface>
      </Surface>
    </Surface>
  );
}
