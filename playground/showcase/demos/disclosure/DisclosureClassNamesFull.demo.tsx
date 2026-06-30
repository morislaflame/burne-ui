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
      <Disclosure.Trigger>Доставка и оплата</Disclosure.Trigger>
      <Disclosure.Content>
        <Text as="p" variant="small" className="text-muted">
          Кастомизация trigger, title, chevron и content через classNames.
        </Text>
      </Disclosure.Content>
    </Disclosure>
  );
}
