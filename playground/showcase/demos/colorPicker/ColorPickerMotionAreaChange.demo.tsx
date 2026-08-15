import gsap from "gsap";

import { ColorPicker } from "@/components/core/ColorPicker";
import { tweenCssColor } from "@/components/core/utils/gsapMotion";

const TL = { overwrite: "auto" as const, force3D: false };

export function ColorPickerMotionAreaChangeDemo() {
  return (
    <ColorPicker
      defaultValue="#22c55e"
      defaultOpen
      motion={{
        area: {
          change: (ctx) => {
            const tl = gsap.timeline({ ...TL });
            tl.to(ctx.el, { scale: 1.02, duration: 0.12 }, 0);
            tl.to(ctx.el, { scale: 1, duration: 0.16 }, 0.12);
            tweenCssColor(ctx.el, "var(--color-primary)");
            return tl;
          },
        },
      }}
    >
      <ColorPicker.Trigger />
      <ColorPicker.Content presets={["#3b82f6", "#22c55e", "#ef4444"]} />
    </ColorPicker>
  );
}
