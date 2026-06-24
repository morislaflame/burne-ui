import { IoCubeOutline } from "react-icons/io5";

import { Expandable } from "@/components/core/Expandable";
import { Text } from "@/components/core/Text";

export function ExpandableShippingCompoundDemo() {
  return (
    <Expandable className="w-full max-w-lg">
      <Expandable.Trigger>
        <Expandable.Message>
          <Expandable.Icon>
            <IoCubeOutline aria-hidden className="size-full" />
          </Expandable.Icon>
          <Expandable.Content>
            <Expandable.Title>Доставка и возврат</Expandable.Title>
            <Expandable.Description>Сроки, стоимость и условия</Expandable.Description>
          </Expandable.Content>
        </Expandable.Message>
      </Expandable.Trigger>
      <Expandable.Panel>
        <div className="flex flex-col gap-small">
          <Text as="p" variant="small">
            <span className="font-medium">По России:</span> 2–5 рабочих дней, от 290 ₽.
          </Text>
          <Text as="p" variant="small" className="text-muted">
            Возврат в течение 14 дней при сохранении товарного вида.
          </Text>
        </div>
      </Expandable.Panel>
    </Expandable>
  );
}
