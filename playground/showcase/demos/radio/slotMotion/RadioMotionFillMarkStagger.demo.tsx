import gsap from "gsap";

import { Radio } from "@/components/core/Radio";
import { tweenCssColor } from "@/components/core/utils/gsapMotion";

export function RadioMotionFillMarkStaggerDemo() {
  return (
    <Radio
      name="radio-motion-stagger"
      value="a"
      defaultChecked
      label="Staggered fill → mark"
      hint="Label color is its own slot; fill factory drives mark."
      motion={{
        indicatorMark: { check: false, uncheck: false },
        label: {
          check: (ctx) => tweenCssColor(ctx.el, "var(--color-primary)", { duration: 0.28 }),
          uncheck: (ctx) =>
            tweenCssColor(ctx.el, "var(--color-foreground)", {
              duration: 0.22,
              clearOnComplete: true,
            }),
        },
        hint: {
          check: (ctx) => tweenCssColor(ctx.el, "var(--color-primary)", { duration: 0.28 }),
          uncheck: (ctx) =>
            tweenCssColor(ctx.el, "var(--color-muted-foreground)", {
              duration: 0.22,
              clearOnComplete: true,
            }),
        },
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
            const tl = ctx.timeline();
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
