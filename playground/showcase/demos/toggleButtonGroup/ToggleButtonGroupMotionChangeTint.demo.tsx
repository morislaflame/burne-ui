import gsap from "gsap";

import { ToggleButtonGroup } from "@/components/composite/ToggleButtonGroup";
import { ToggleButton } from "@/components/core/ToggleButton";
import { tweenCssColor } from "@/components/core/utils/gsapMotion";

const TL = { overwrite: "auto" as const, force3D: false };

export function ToggleButtonGroupMotionChangeTintDemo() {
  return (
    <ToggleButtonGroup
      type="single"
      defaultValue="a"
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
      <ToggleButton value="a">Day</ToggleButton>
      <ToggleButton value="b">Night</ToggleButton>
    </ToggleButtonGroup>
  );
}
