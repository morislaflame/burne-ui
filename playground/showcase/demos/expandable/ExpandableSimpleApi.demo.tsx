import { Expandable } from "@/components/core/Expandable";
import { Text } from "@/components/core/Text";

import { EXPANDABLE_INFO_ICON } from "../../shared/constants";

export function ExpandableSimpleApiDemo() {
  return (
    <Expandable title="Уведомления" icon={EXPANDABLE_INFO_ICON} description="Simple API">
      <Text as="p" variant="small" className="text-muted">
        Контент панели Expandable — props title и icon на корне.
      </Text>
    </Expandable>
  );
}
