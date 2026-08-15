import gsap from "gsap";

import { Checkbox } from "@/components/core/Checkbox";
import { tweenCssColor } from "@/components/core/utils/gsapMotion";

function hostText(el: HTMLElement): HTMLElement | null {
  const host = el.closest("label, fieldset");
  return host instanceof HTMLElement ? host : null;
}

export function CheckboxMotionLabelColorDemo() {
  return (
    <Checkbox
      defaultChecked
      label="Accent label"
      hint="Checked label uses --color-primary."
      motion={{
        indicatorFill: {
          check: (ctx) => {
            const tl = gsap.timeline({
              defaults: { overwrite: "auto", force3D: false },
            });
            tl.fromTo(
              ctx.el,
              { scale: 0, autoAlpha: 0 },
              { scale: 1, autoAlpha: 1, duration: 0.32, ease: "power2.out" },
              0,
            );
            const text = hostText(ctx.el);
            if (text) {
              if (!text.dataset.motionColorRest) {
                text.dataset.motionColorRest = getComputedStyle(text).color;
              }
              tl.add(
                tweenCssColor(text, "var(--color-primary)", { duration: 0.28 }),
                0,
              );
            }
            return tl;
          },
          uncheck: (ctx) => {
            const tl = gsap.timeline({
              defaults: { overwrite: "auto", force3D: false },
            });
            tl.to(ctx.el, { scale: 0, autoAlpha: 0, duration: 0.2 }, 0);
            const text = hostText(ctx.el);
            if (text) {
              const rest = text.dataset.motionColorRest || "var(--color-foreground)";
              tl.add(
                tweenCssColor(text, rest, {
                  duration: 0.22,
                  clearOnComplete: true,
                  onComplete: () => {
                    delete text.dataset.motionColorRest;
                  },
                }),
                0,
              );
            }
            return tl;
          },
        },
      }}
    />
  );
}
