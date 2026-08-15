import gsap from "gsap";

import { Radio } from "@/components/core/Radio";

export function RadioMotionFillMarkStaggerDemo() {
  return (
    <Radio
      name="radio-motion-stagger"
      value="a"
      defaultChecked
      label="Staggered fill → mark"
      hint="indicatorMark check/uncheck is false; fill factory drives both."
      motion={{
        indicatorMark: { check: false, uncheck: false },
        indicatorFill: {
          check: (ctx) => {
            const tl = gsap.timeline({
              defaults: { overwrite: "auto", force3D: false },
            });
            tl.fromTo(
              ctx.el,
              { scale: 0, autoAlpha: 0, transformOrigin: "50% 100%" },
              {
                scale: 1,
                autoAlpha: 1,
                duration: 0.32,
                ease: "power2.out",
                transformOrigin: "50% 100%",
              },
              0,
            );
            if (ctx.targets.mark) {
              tl.fromTo(
                ctx.targets.mark,
                { y: 6, autoAlpha: 0, rotate: -20 },
                {
                  y: 0,
                  autoAlpha: 1,
                  rotate: 0,
                  duration: 0.28,
                  ease: "back.out(1.8)",
                  immediateRender: false,
                },
                0.14,
              );
            }
            return tl;
          },
          uncheck: (ctx) => {
            const tl = gsap.timeline({
              defaults: { overwrite: "auto", force3D: false },
            });
            if (ctx.targets.mark) {
              tl.to(ctx.targets.mark, { y: 4, autoAlpha: 0, duration: 0.14 }, 0);
            }
            tl.to(ctx.el, { scale: 0, autoAlpha: 0, duration: 0.2 }, 0.06);
            return tl;
          },
        },
      }}
    />
  );
}
