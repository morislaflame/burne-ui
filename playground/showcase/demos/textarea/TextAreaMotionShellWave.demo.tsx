import gsap from "gsap";

import { TextArea } from "@/components/core/TextArea";

const TL = { overwrite: "auto" as const, force3D: false };

export function TextAreaMotionShellWaveDemo() {
  return (
    <TextArea
      className="w-full max-w-md"
      label="Shell wave"
      rows={3}
      defaultValue="Hover: shell tilts, text shifts, handle spins."
      hint="ctx.targets.control + resizeHandle from shell hover"
      motion={{
        shell: {
          hoverIn: (ctx) => {
            const tl = gsap.timeline({ ...TL });
            tl.to(ctx.el, { rotate: 0.8, y: -3, duration: 0.24 }, 0);
            if (ctx.targets.control) {
              tl.to(ctx.targets.control, { x: 8, duration: 0.24 }, 0);
            }
            if (ctx.targets.resizeHandle) {
              tl.to(ctx.targets.resizeHandle, { rotate: 90, scale: 1.15, duration: 0.28 }, 0);
            }
            return tl;
          },
          hoverOut: (ctx) => {
            const tl = gsap.timeline({ ...TL });
            tl.to(ctx.el, { rotate: 0, y: 0, duration: 0.18 }, 0);
            if (ctx.targets.control) {
              tl.to(ctx.targets.control, { x: 0, duration: 0.18 }, 0);
            }
            if (ctx.targets.resizeHandle) {
              tl.to(ctx.targets.resizeHandle, { rotate: 0, scale: 1, duration: 0.2 }, 0);
            }
            return tl;
          },
        },
      }}
    />
  );
}
