import { useState } from "react";

import { SelectionIndicator } from "@/components/core/SelectionIndicator";
import { Text } from "@/components/core/Text";

export function SelectionIndicatorClassNamesDemo() {
  const [selected, setSelected] = useState(true);

  return (
    <div className="flex w-full max-w-lg flex-col gap-mid">
      <Text as="p" variant="small" className="font-medium">
        classNames: shell / fill / mark
      </Text>
      <div className="flex flex-wrap items-end gap-xlarge">
        <SelectionIndicator
          size="large"
          variant="default"
          selected={selected}
          check
          classNames={{
            shell: "rounded-mid ring-1 ring-primary/30",
            fill: "rounded-[inherit] bg-danger",
            mark: "text-danger-foreground",
          }}
        />
        <SelectionIndicator size="large" variant="default" selected={selected} check />
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
