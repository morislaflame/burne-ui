import { Disclosure } from "@/components/core/Disclosure";
import { Text } from "@/components/core/Text";

export function DisclosureClassNamesFullDemo() {
  return (
    <Disclosure
      variant="outline"
      defaultOpen
      classNames={{
        trigger: "border border-info/30 rounded-mid",
        triggerTitle: "text-info font-semibold",
        triggerChevron: "text-info",
        contentPanel: "border border-info/20 bg-info/5",
      }}
    >
      <Disclosure.Trigger>Delivery and payment</Disclosure.Trigger>
      <Disclosure.Content>
        <Text as="p" variant="small" className="text-muted">
          Customization trigger, title, chevron and content through classNames.
        </Text>
      </Disclosure.Content>
    </Disclosure>
  );
}
