import { Surface } from "@/components/core/Surface";
import { Text } from "@/components/core/Text";

export function SurfaceGlassStackDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-mid rounded-mid bg-gradient-to-br from-primary/10 to-info/10 p-mid">
      <Surface variant="gloss" padding="mid" radius="mid">
        <Text as="p" variant="small">
          Gloss Surface on a gradient background - glass card.
        </Text>
      </Surface>
      <Surface variant="gloss" padding="small" radius="base" className="w-3/4 self-end">
        <Text as="span" variant="xsmall" className="text-muted">
          Second layer with less padding
        </Text>
      </Surface>
    </div>
  );
}
