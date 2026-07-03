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
            <Expandable.Title>Delivery and returns</Expandable.Title>
            <Expandable.Description>Terms, cost and conditions</Expandable.Description>
          </Expandable.Content>
        </Expandable.Message>
      </Expandable.Trigger>
      <Expandable.Panel>
        <div className="flex flex-col gap-small">
          <Text as="p" variant="small">
            <span className="font-medium">Across Russia:</span> 2–5 working days, from 290 ₽.
          </Text>
          <Text as="p" variant="small" className="text-muted">
            Return within 14 days if the product is in original condition.
          </Text>
        </div>
      </Expandable.Panel>
    </Expandable>
  );
}
