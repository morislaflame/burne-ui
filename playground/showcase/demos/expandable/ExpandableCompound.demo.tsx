import { Expandable } from "@/components/core/Expandable";
import { Text } from "@/components/core/Text";

import { EXPANDABLE_INFO_ICON } from "../../shared/constants";

export function ExpandableCompoundDemo() {
  return (
    <Expandable>
      <Expandable.Trigger>
        <Expandable.Message>
          <Expandable.Icon>{EXPANDABLE_INFO_ICON}</Expandable.Icon>
          <Expandable.Content>
            <Expandable.Title>Compound API</Expandable.Title>
            <Expandable.Description>Trigger + Message + Panel</Expandable.Description>
          </Expandable.Content>
        </Expandable.Message>
      </Expandable.Trigger>
      <Expandable.Panel>
        <Text as="p" variant="small" className="text-muted">
          Полный compound-вариант с иконкой и описанием в триггере.
        </Text>
      </Expandable.Panel>
    </Expandable>
  );
}
