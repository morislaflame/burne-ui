import gsap from "gsap";

import { ColorSwatch } from "@/components/core/ColorPicker";

const TL = { overwrite: "auto" as const, force3D: false };

export function ColorSwatchMotionPressSpinDemo() {
  return (
    <ColorSwatch
      color="#a855f7"
      size="large"
      aria-label="Press spin swatch"
      onClick={() => {}}
      motion={{
        root: {
          pressIn: (ctx) =>
            gsap.to(ctx.el, {
              rotate: 180,
              scale: 0.86,
              duration: 0.22,
              ease: "back.out(1.8)",
              ...TL,
            }),
          pressOut: (ctx) =>
            gsap.to(ctx.el, {
              rotate: 0,
              scale: 1,
              duration: 0.28,
              ease: "power2.inOut",
              ...TL,
            }),
        },
      }}
    />
  );
}
