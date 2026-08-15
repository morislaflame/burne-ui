import gsap from "gsap";
import { IoMoon, IoSunny } from "react-icons/io5";

import { Switch } from "@/components/core/Switch";

export function SwitchMotionIconsDemo() {
  return (
    <Switch
      defaultChecked
      label="Spinning icons"
      hint="iconOn / iconOff factories — rotation on check."
      iconOff={<IoMoon aria-hidden className="size-full" />}
      iconOn={<IoSunny aria-hidden className="size-full" />}
      motion={{
        iconOn: {
          check: (ctx) =>
            gsap.fromTo(
              ctx.el,
              { autoAlpha: 0, rotation: -40, scale: 0.8 },
              {
                autoAlpha: 1,
                rotation: 0,
                scale: 1,
                duration: 0.35,
                ease: "back.out(1.6)",
                force3D: false,
              },
            ),
          uncheck: (ctx) =>
            gsap.to(ctx.el, { autoAlpha: 0, rotation: 30, duration: 0.18, force3D: false }),
        },
        iconOff: {
          check: (ctx) =>
            gsap.to(ctx.el, { autoAlpha: 0, rotation: 30, duration: 0.18, force3D: false }),
          uncheck: (ctx) =>
            gsap.fromTo(
              ctx.el,
              { autoAlpha: 0, rotation: 40, scale: 0.8 },
              {
                autoAlpha: 1,
                rotation: 0,
                scale: 1,
                duration: 0.35,
                ease: "back.out(1.6)",
                force3D: false,
              },
            ),
        },
      }}
    />
  );
}
