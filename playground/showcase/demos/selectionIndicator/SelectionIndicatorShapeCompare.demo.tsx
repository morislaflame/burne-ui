import { useState } from "react";

import { SelectionIndicator } from "@/components/core/SelectionIndicator";
import { Text } from "@/components/core/Text";

export function SelectionIndicatorShapeCompareDemo() {
  const [selected, setSelected] = useState(true);

  return (
    <div className="flex w-full max-w-lg flex-col gap-large">
      <Text as="p" variant="small" className="font-medium">
        Shell shape
      </Text>
      <div className="flex flex-wrap items-end gap-2xlarge">
        <div className="flex flex-col items-center gap-xsmall">
          <SelectionIndicator size="large" variant="default" selected={selected} check />
          <Text as="span" variant="xsmall" className="text-muted">
            rounded-full
          </Text>
        </div>
        <div className="flex flex-col items-center gap-xsmall">
          <SelectionIndicator
            size="large"
            variant="default"
            selected={selected}
            check
            classNames={{
              root: "rounded-mid",
            }}
          />
          <Text as="span" variant="xsmall" className="text-muted">
            rounded-mid
          </Text>
        </div>
      </div>
      <label className="flex cursor-pointer items-center gap-small text-sm">
        <input
          type="checkbox"
          checked={selected}
          onChange={(e) => setSelected(e.target.checked)}
          className="size-4"
        />
        Selected
      </label>
    </div>
  );
}
