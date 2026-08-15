import gsap from "gsap";

import { Switch } from "@/components/core/Switch";

export function SwitchMotionBounceThumbDemo() {
  return (
    <Switch
      defaultChecked
      label="Bounce thumb"
      hint="thumb factory — back.out instead of switchThumb."
      motion={{
        thumb: {
          check: (ctx) => {
            const travel =
              typeof ctx.params.getTravelPx === "function"
                ? Number(ctx.params.getTravelPx()) || 0
                : 0;
            return gsap.to(ctx.el, {
              x: travel,
              duration: 0.45,
              ease: "back.out(1.6)",
              overwrite: "auto",
              force3D: false,
            });
          },
          uncheck: (ctx) =>
            gsap.to(ctx.el, {
              x: 0,
              duration: 0.22,
              ease: "power2.in",
              overwrite: "auto",
              force3D: false,
            }),
        },
      }}
    />
  );
}
