import { Surface } from "@/components/core/Surface";
import { Text } from "@/components/core/Text";

export function SurfaceMotionInstantEnterDemo() {
  return (
    <Surface padding="large" motion={{ root: { enter: false } }}>
      <Text variant="base">Instant enter skip</Text>
    </Surface>
  );
}
