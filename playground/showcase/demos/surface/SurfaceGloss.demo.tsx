import { Surface } from "@/components/core/Surface";
import { Text } from "@/components/core/Text";

export function SurfaceGlossDemo() {
  return (
    <Surface variant="gloss" padding="large" className="min-w-[12rem]">
      <Text as="span" variant="small">
        Glass surface for grouping content.
      </Text>
    </Surface>
  );
}
