import gsap from "gsap";

import { CheckboxGroup } from "@/components/composite/CheckboxGroup";
import { Checkbox } from "@/components/core/Checkbox";
import { tweenCssColor } from "@/components/core/utils/gsapMotion";

const TL = { overwrite: "auto" as const, force3D: false };

export function CheckboxGroupMotionChangeTintDemo() {
  return (
    <CheckboxGroup
      selection="single"
      defaultValue="pro"
      motion={{
        root: {
          change: (ctx) => {
            const tl = gsap.timeline({ ...TL });
            tl.to(ctx.el, { y: -2, duration: 0.1 }, 0);
            tl.to(ctx.el, { y: 0, duration: 0.14 }, 0.1);
            tweenCssColor(ctx.el, "var(--color-primary)");
            return tl;
          },
        },
      }}
    >
      <CheckboxGroup.Legend>
        <CheckboxGroup.Label>Single</CheckboxGroup.Label>
      </CheckboxGroup.Legend>
      <CheckboxGroup.List>
        <Checkbox value="pro" label="Pro" />
        <Checkbox value="team" label="Team" />
      </CheckboxGroup.List>
    </CheckboxGroup>
  );
}
