import { useState } from "react";

import { SelectionIndicator } from "@/components/core/SelectionIndicator";

import { IndicatorToggle } from "./IndicatorToggle";

export function SelectionIndicatorMotionInstantFillDemo() {
  const [selected, setSelected] = useState(true);

  return (
    <IndicatorToggle selected={selected} onToggle={() => setSelected((value) => !value)}>
      <SelectionIndicator
        size="large"
        selected={selected}
        check
        motion={{ fill: { check: false, uncheck: false } }}
      />
    </IndicatorToggle>
  );
}
