import { Disclosure } from "@/components/core/Disclosure";
import { Text } from "@/components/core/Text";

export function DisclosureMotionTitleLiftQuietDemo() {
  return (
    <Disclosure
      className="max-w-lg"
      motion={{ titleLift: { hoverIn: false, hoverOut: false } }}
    >
      <Disclosure.Trigger>Quiet hover</Disclosure.Trigger>
      <Disclosure.Content>
        <Text as="p" variant="small" className="text-muted">
          `titleLift.hoverIn/Out: false` skips lift. Press squeeze on the title still runs.
        </Text>
      </Disclosure.Content>
    </Disclosure>
  );
}
