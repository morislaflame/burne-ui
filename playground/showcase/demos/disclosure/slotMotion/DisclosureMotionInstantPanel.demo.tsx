import { Disclosure } from "@/components/core/Disclosure";
import { Text } from "@/components/core/Text";

export function DisclosureMotionInstantPanelDemo() {
  return (
    <Disclosure className="max-w-lg" motion={{ contentShell: { enter: false, leave: false } }}>
      <Disclosure.Trigger>No height tween</Disclosure.Trigger>
      <Disclosure.Content>
        <Text as="p" variant="small" className="text-muted">
          Instant open/close; chevron still rotates. Hover/press on the title still run.
        </Text>
      </Disclosure.Content>
    </Disclosure>
  );
}
