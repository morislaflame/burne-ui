import { Disclosure } from "@/components/core/Disclosure";
import { Text } from "@/components/core/Text";

export function DisclosureMotionGroupChevronDemo() {
  return (
    <Disclosure.Group
      variant="outline"
      defaultValue="one"
      className="max-w-lg"
      motion={{ chevron: { enter: false, leave: false } }}
    >
      <Disclosure value="one">
        <Disclosure.Trigger>Group chevron snap</Disclosure.Trigger>
        <Disclosure.Content>
          <Text as="p" variant="small" className="text-muted">
            `Disclosure.Group` motion merges into every item. Chevrons snap; height still tweens.
          </Text>
        </Disclosure.Content>
      </Disclosure>
      <Disclosure value="two">
        <Disclosure.Trigger>Second item</Disclosure.Trigger>
        <Disclosure.Content>
          <Text as="p" variant="small" className="text-muted">
            Same map — no per-item `motion` needed.
          </Text>
        </Disclosure.Content>
      </Disclosure>
    </Disclosure.Group>
  );
}
