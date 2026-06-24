import { Surface } from "@/components/core/Surface";
import { Text } from "@/components/core/Text";

export function SurfaceGlossDemo() {
  return (
    <Surface variant="gloss" padding="mid" className="min-w-[12rem]">
      <Text as="span" variant="small">
        Стеклянная поверхность для группировки контента.
      </Text>
    </Surface>
  );
}
