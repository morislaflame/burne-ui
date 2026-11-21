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
            ctx.fromTo(
              { autoAlpha: 0, rotation: -40, scale: 0.8 },
              {
                autoAlpha: 1,
                rotation: 0,
                scale: 1,
                duration: 0.35,
                ease: "back.out(1.6)",
              },
            ),
          uncheck: (ctx) => ctx.to({ autoAlpha: 0, rotation: 30, duration: 0.18 }),
        },
        iconOff: {
          check: (ctx) => ctx.to({ autoAlpha: 0, rotation: 30, duration: 0.18 }),
          uncheck: (ctx) =>
            ctx.fromTo(
              { autoAlpha: 0, rotation: 40, scale: 0.8 },
              {
                autoAlpha: 1,
                rotation: 0,
                scale: 1,
                duration: 0.35,
                ease: "back.out(1.6)",
              },
            ),
        },
      }}
    />
  );
}
