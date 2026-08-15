import gsap from "gsap";

import { ColorSwatch } from "@/components/core/ColorPicker";

const TL = { overwrite: "auto" as const, force3D: false };

export function ColorSwatchMotionPulseDemo() {
  return (
    <ColorSwatch
      color="#22c55e"
      size="large"
      aria-label="Pulse swatch"
      onClick={() => {}}
      motion={{
        root: {
          hoverIn: (ctx) => {
            const tl = gsap.timeline({ ...TL });
            tl.to(ctx.el, { rotate: -8, scale: 1.08, duration: 0.16 }, 0);
            tl.to(ctx.el, { rotate: 6, duration: 0.12 }, 0.12);
            tl.to(ctx.el, { rotate: -2, duration: 0.1 }, 0.22);
            return tl;
          },
          hoverOut: (ctx) =>
            gsap.to(ctx.el, { rotate: 0, scale: 1, duration: 0.18, ease: "power2.out", ...TL }),
        },
      }}
    />
  );
}
