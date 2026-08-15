import gsap from "gsap";

import { ColorPicker } from "@/components/core/ColorPicker";

const TL = { overwrite: "auto" as const, force3D: false };

export function ColorPickerMotionPanelWaveDemo() {
  return (
    <ColorPicker
      defaultValue="#3b82f6"
      defaultOpen
      motion={{
        contentPanel: {
          enter: (ctx) => {
            const tl = gsap.timeline({ ...TL });
            tl.fromTo(ctx.el, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.28 }, 0);
            if (ctx.targets.area) {
              tl.fromTo(ctx.targets.area, { scale: 0.96 }, { scale: 1, duration: 0.22 }, 0.04);
            }
            return tl;
          },
        },
      }}
    >
      <ColorPicker.Trigger />
      <ColorPicker.Content />
    </ColorPicker>
  );
}
