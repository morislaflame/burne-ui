import { Disclosure } from "@/components/core/Disclosure";
import { Text } from "@/components/core/Text";

export function DisclosureGlossDemo() {
  return (
    <Disclosure variant="gloss" defaultOpen className="max-w-md">
      <Disclosure.Trigger>Gloss disclosure</Disclosure.Trigger>
      <Disclosure.Content>
        <Text as="p" variant="small" className="text-muted">
          Glass panel with hover-lift on the root.
        </Text>
      </Disclosure.Content>
    </Disclosure>
  );
}
