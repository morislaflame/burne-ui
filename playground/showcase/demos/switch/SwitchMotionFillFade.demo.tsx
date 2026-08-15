import gsap from "gsap";

import { Switch } from "@/components/core/Switch";

export function SwitchMotionFillFadeDemo() {
  return (
    <Switch
      defaultChecked
      label="Slow fill"
      hint="fill check/uncheck uses a longer fade."
      motion={{
        fill: {
          check: (ctx) =>
            gsap.fromTo(
              ctx.el,
              { autoAlpha: 0 },
              { autoAlpha: 1, duration: 0.55, ease: "power2.out" },
            ),
          uncheck: (ctx) => gsap.to(ctx.el, { autoAlpha: 0, duration: 0.4, ease: "power2.in" }),
        },
      }}
    />
  );
}
