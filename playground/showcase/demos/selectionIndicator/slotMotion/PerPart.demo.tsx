import { useState } from "react";

import { SelectionIndicator } from "@/components/core/SelectionIndicator";

import { IndicatorToggle } from "./IndicatorToggle";

export function SelectionIndicatorMotionPerPartDemo() {
  const [selected, setSelected] = useState(false);

  return (
    <IndicatorToggle selected={selected} onToggle={() => setSelected((value) => !value)}>
      <SelectionIndicator size="large" selected={selected} check>
        <SelectionIndicator.Fill
          motion={{
            check: (ctx) =>
              ctx.fromTo(
                { scale: 0, autoAlpha: 0 },
                { scale: 1, autoAlpha: 1, duration: 0.32 },
              ),
            uncheck: (ctx) => ctx.to({ scale: 0, autoAlpha: 0, duration: 0.16 }),
          }}
        />
        <SelectionIndicator.Mark
          motion={{
            check: (ctx) =>
              ctx.fromTo(
                { rotate: -70, autoAlpha: 0 },
                { rotate: 0, autoAlpha: 1, duration: 0.34, ease: "back.out(2)" },
              ),
            uncheck: (ctx) => ctx.to({ rotate: 40, autoAlpha: 0, duration: 0.16 }),
          }}
        />
      </SelectionIndicator>
    </IndicatorToggle>
  );
}
