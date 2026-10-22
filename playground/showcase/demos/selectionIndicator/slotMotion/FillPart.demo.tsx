import { useState } from "react";

import { SelectionIndicator } from "@/components/core/SelectionIndicator";

import { IndicatorToggle } from "./IndicatorToggle";

export function SelectionIndicatorMotionFillPartDemo() {
  const [selected, setSelected] = useState(false);

  return (
    <IndicatorToggle selected={selected} onToggle={() => setSelected((value) => !value)}>
      <SelectionIndicator size="large" selected={selected} check>
        <SelectionIndicator.Fill
          motion={{
            check: (ctx) =>
              ctx.fromTo(
                { scale: 0, autoAlpha: 0 },
                { scale: 1, autoAlpha: 1, duration: 0.35 },
              ),
            uncheck: (ctx) => ctx.to({ scale: 0, autoAlpha: 0, duration: 0.18 }),
          }}
        />
      </SelectionIndicator>
    </IndicatorToggle>
  );
}
