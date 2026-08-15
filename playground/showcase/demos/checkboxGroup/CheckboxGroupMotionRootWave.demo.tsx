import gsap from "gsap";

import { CheckboxGroup } from "@/components/composite/CheckboxGroup";
import { Checkbox } from "@/components/core/Checkbox";

const TL = { overwrite: "auto" as const, force3D: false };

export function CheckboxGroupMotionRootWaveDemo() {
  return (
    <CheckboxGroup
      motion={{
        root: {
          enter: (ctx) =>
            gsap.fromTo(ctx.el, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3, ...TL }),
        },
        list: {
          enter: (ctx) => gsap.fromTo(ctx.el, { x: -6 }, { x: 0, duration: 0.22, ...TL }),
        },
      }}
    >
      <CheckboxGroup.Legend>
        <CheckboxGroup.Label>Plan</CheckboxGroup.Label>
      </CheckboxGroup.Legend>
      <CheckboxGroup.List>
        <Checkbox value="pro" label="Pro" />
        <Checkbox value="team" label="Team" />
      </CheckboxGroup.List>
    </CheckboxGroup>
  );
}
