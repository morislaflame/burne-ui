import gsap from "gsap";

import { ToggleButtonGroup } from "@/components/composite/ToggleButtonGroup";
import { ToggleButton } from "@/components/core/ToggleButton";

const TL = { overwrite: "auto" as const, force3D: false };

export function ToggleButtonGroupMotionRootWaveDemo() {
  return (
    <ToggleButtonGroup
      type="single"
      defaultValue="a"
      motion={{
        root: {
          enter: (ctx) =>
            gsap.fromTo(ctx.el, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3, ...TL }),
        },
      }}
    >
      <ToggleButton value="a">A</ToggleButton>
      <ToggleButton value="b">B</ToggleButton>
    </ToggleButtonGroup>
  );
}
