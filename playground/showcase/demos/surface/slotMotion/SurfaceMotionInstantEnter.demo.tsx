import { Surface } from "@/components/core/Surface";
import { Text } from "@/components/core/Text";

export function SurfaceMotionInstantEnterDemo() {
  return (
    <Surface padding="large" motion={{ root: { enter: false } }}>
      <Text textStyle="base">Instant enter skip</Text>
    </Surface>
  );
}
