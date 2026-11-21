import { useState } from "react";

import { SelectionIndicator } from "@/components/core/SelectionIndicator";

import { IndicatorToggle } from "./IndicatorToggle";

export function SelectionIndicatorMotionClassNamesDemo() {
  const [selected, setSelected] = useState(false);

  return (
    <IndicatorToggle selected={selected} onToggle={() => setSelected((value) => !value)}>
      <SelectionIndicator
        size="large"
        selected={selected}
        check
        classNames={{
          fill: "bg-danger",
          mark: "text-danger-foreground",
        }}
        motion={{
          fill: {
            check: { scale: 1, autoAlpha: 1, duration: 0.4 },
            uncheck: { scale: 0, autoAlpha: 0, duration: 0.18 },
          },
        }}
      />
    </IndicatorToggle>
  );
}
