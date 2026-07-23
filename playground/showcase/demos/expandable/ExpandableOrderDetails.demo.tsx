import { Expandable } from "@/components/core/Expandable";
import { Surface } from "@/components/core/Surface";
import { Text } from "@/components/core/Text";

import { EXPANDABLE_INFO_ICON } from "../../shared/constants";

export function ExpandableOrderDetailsDemo() {
  return (
    <Surface variant="secondary" padding="large" className="w-full max-w-md">
      <Text as="p" variant="small" className="mb-large font-medium">
        Order #1042
      </Text>
      <Expandable defaultOpen title="Order contents" icon={EXPANDABLE_INFO_ICON} description="3 positions">
        <ul className="flex flex-col gap-xsmall text-sm text-muted">
          <li>Parka Arctic — 1 pcs.</li>
          <li>Cap Wool — 1 pcs.</li>
          <li>Gloves Pro — 1 pcs.</li>
        </ul>
      </Expandable>
    </Surface>
  );
}
