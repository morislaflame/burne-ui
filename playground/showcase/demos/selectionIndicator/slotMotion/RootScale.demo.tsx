import { useState } from "react";

import { SelectionIndicator } from "@/components/core/SelectionIndicator";

import { IndicatorToggle } from "./IndicatorToggle";

export function SelectionIndicatorMotionRootScaleDemo() {
  const [selected, setSelected] = useState(false);

  return (
    <IndicatorToggle selected={selected} onToggle={() => setSelected((value) => !value)}>
      <SelectionIndicator
        size="large"
        selected={selected}
        check
        motion={{
          root: {
            check: { scale: 1.08, duration: 0.22 },
            uncheck: { scale: 1, duration: 0.16 },
          },
        }}
      />
    </IndicatorToggle>
  );
}
