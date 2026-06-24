import { Disclosure } from "@/components/core/Disclosure";
import { Text } from "@/components/core/Text";

export function DisclosureSingleDemo() {
  return (
    <Disclosure className="max-w-lg" defaultOpen>
      <Disclosure.Trigger>Одиночный блок</Disclosure.Trigger>
      <Disclosure.Content>
        <Text as="p" variant="small" className="text-muted">
          Disclosure с анимацией высоты — альтернатива Accordion для одиночных блоков.
        </Text>
      </Disclosure.Content>
    </Disclosure>
  );
}
