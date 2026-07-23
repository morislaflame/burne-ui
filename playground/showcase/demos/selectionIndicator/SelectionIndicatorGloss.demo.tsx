import { IoCheckmark } from "react-icons/io5";

import { SelectionIndicator } from "@/components/core/SelectionIndicator";
import { Text } from "@/components/core/Text";

export function SelectionIndicatorGlossDemo() {
  return (
    <div className="flex flex-wrap items-center gap-large">
      <div className="flex flex-col items-center gap-xsmall">
        <SelectionIndicator size="base" variant="gloss" selected={false} />
        <Text as="span" variant="xsmall" className="text-muted">
          off
        </Text>
      </div>
      <div className="flex flex-col items-center gap-xsmall">
        <SelectionIndicator size="base" variant="gloss" selected check />
        <Text as="span" variant="xsmall" className="text-muted">
          on
        </Text>
      </div>
      <div className="flex flex-col items-center gap-xsmall">
        <SelectionIndicator
          size="base"
          variant="gloss"
          selected
          check
          icon={<IoCheckmark aria-hidden />}
        />
        <Text as="span" variant="xsmall" className="text-muted">
          custom icon
        </Text>
      </div>
    </div>
  );
}
