import { Surface } from "@/components/core/Surface";
import { Text } from "@/components/core/Text";

export function SurfaceGlassStackDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-large rounded-large bg-gradient-to-br from-primary/10 to-info/10 p-large">
      <Surface variant="default" padding="large" radius="mid">
        <Text as="p" variant="small">
          Surface on a gradient background.
        </Text>
      </Surface>
      <Surface variant="default" padding="small" radius="base" className="w-3/4 self-end">
        <Text as="span" variant="xsmall" className="text-muted">
          Second layer with less padding
        </Text>
      </Surface>
    </div>
  );
}
