import { Disclosure } from "@/components/core/Disclosure";
import { Text } from "@/components/core/Text";

const items = [
  { value: "card-1", title: "Card variant" },
  { value: "card-2", title: "Second block" },
] as const;

export function DisclosureCardGroupDemo() {
  return (
    <Disclosure.Group variant="card" defaultValue="card-1" className="max-w-lg">
      {items.map(({ value, title }) => (
        <Disclosure key={value} value={value}>
          <Disclosure.Trigger>{title}</Disclosure.Trigger>
          <Disclosure.Content>
            <Text as="p" variant="small" className="text-muted">
              Disclosure.Group variant=&quot;card&quot; — general card with dividers.
            </Text>
          </Disclosure.Content>
        </Disclosure>
      ))}
    </Disclosure.Group>
  );
}
