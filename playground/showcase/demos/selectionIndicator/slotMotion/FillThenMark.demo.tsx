import { useState } from "react";

import { SelectionIndicator } from "@/components/core/SelectionIndicator";

import { IndicatorToggle } from "./IndicatorToggle";

export function SelectionIndicatorMotionFillThenMarkDemo() {
  const [selected, setSelected] = useState(false);

  return (
    <IndicatorToggle selected={selected} onToggle={() => setSelected((value) => !value)}>
      <SelectionIndicator
        size="large"
        selected={selected}
        check
        motion={{
          fill: { check: false, uncheck: false },
          mark: { check: false, uncheck: false },
          root: {
            check: (ctx) => {
              const tl = ctx.timeline();
              tl.fromTo(
                ctx.targets.fill,
                { scale: 0, autoAlpha: 0 },
                { scale: 1, autoAlpha: 1, duration: 0.28 },
                0,
              );
              tl.fromTo(
                ctx.targets.mark,
                { scale: 0.6, autoAlpha: 0 },
                { scale: 1, autoAlpha: 1, duration: 0.22 },
                0.12,
              );
              return tl;
            },
            uncheck: (ctx) => {
              const tl = ctx.timeline();
              tl.to(ctx.targets.mark, { scale: 0.92, autoAlpha: 0, duration: 0.16 }, 0);
              tl.to(ctx.targets.fill, { scale: 0, autoAlpha: 0, duration: 0.2 }, 0.06);
              return tl;
            },
          },
        }}
      />
    </IndicatorToggle>
  );
}
