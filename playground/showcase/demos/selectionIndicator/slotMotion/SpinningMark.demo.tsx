import { useState } from "react";

import { SelectionIndicator } from "@/components/core/SelectionIndicator";

import { IndicatorToggle } from "./IndicatorToggle";

export function SelectionIndicatorMotionSpinningMarkDemo() {
  const [selected, setSelected] = useState(false);

  return (
    <IndicatorToggle selected={selected} onToggle={() => setSelected((value) => !value)}>
      <SelectionIndicator
        size="large"
        selected={selected}
        check
        motion={{
          mark: {
            check: (ctx) =>
              ctx.fromTo(
                { rotate: -90, scale: 0.4, autoAlpha: 0 },
                { rotate: 0, scale: 1, autoAlpha: 1, duration: 0.4, ease: "back.out(2.2)" },
              ),
            uncheck: (ctx) => ctx.to({ rotate: 45, scale: 0.5, autoAlpha: 0, duration: 0.18 }),
          },
        }}
      />
    </IndicatorToggle>
  );
}
