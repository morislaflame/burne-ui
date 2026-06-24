import { Surface } from "@/components/core/Surface";
import { Text } from "@/components/core/Text";

export function SurfaceGlassStackDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-mid rounded-mid bg-gradient-to-br from-primary/10 to-info/10 p-mid">
      <Surface variant="gloss" padding="mid" radius="mid">
        <Text as="p" variant="small">
          Gloss Surface на градиентном фоне — стеклянная карточка.
        </Text>
      </Surface>
      <Surface variant="gloss" padding="small" radius="base" className="w-3/4 self-end">
        <Text as="span" variant="tools" className="text-muted">
          Второй слой с меньшим padding
        </Text>
      </Surface>
    </div>
  );
}
