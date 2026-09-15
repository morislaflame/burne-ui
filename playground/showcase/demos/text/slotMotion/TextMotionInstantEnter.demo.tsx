import { Text } from "@/components/core/Text";

export function TextMotionInstantEnterDemo() {
  return (
    <Text variant="large" motion={{ root: { enter: false } }}>
      Instant enter skip
    </Text>
  );
}
