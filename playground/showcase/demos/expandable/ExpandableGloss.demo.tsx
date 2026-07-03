import { Expandable } from "@/components/core/Expandable";
import { Text } from "@/components/core/Text";

import { EXPANDABLE_INFO_ICON } from "../../shared/constants";

export function ExpandableGlossDemo() {
  return (
    <Expandable
      variant="gloss"
      title="Gloss"
      icon={EXPANDABLE_INFO_ICON}
      description="Glass panel with hover-lift"
    >
      <Text as="p" variant="small" className="text-muted">
        variant=&quot;gloss&quot; on the root Expandable.
      </Text>
    </Expandable>
  );
}
