import gsap from "gsap";

import { TextArea } from "@/components/core/TextArea";
import { tweenCssColor } from "@/components/core/utils/gsapMotion";

const TL = { overwrite: "auto" as const, force3D: false };

export function TextAreaMotionControlTintDemo() {
  return (
    <TextArea
      className="w-full max-w-md"
      label="Control tint"
      rows={3}
      defaultValue="Press the shell — text tints primary, handle kicks."
      hint="pressIn timeline + tweenCssColor on control"
      motion={{
        shell: {
          pressIn: (ctx) => {
            const tl = gsap.timeline({ ...TL });
            tl.to(ctx.el, { scale: 0.985, duration: 0.1, yoyo: true, repeat: 1 }, 0);
            if (ctx.targets.control) {
              tweenCssColor(ctx.targets.control, "var(--color-primary)");
            }
            if (ctx.targets.resizeHandle) {
              tl.to(ctx.targets.resizeHandle, { y: -4, rotate: -25, duration: 0.14, yoyo: true, repeat: 1 }, 0);
            }
            return tl;
          },
          pressOut: (ctx) => {
            if (ctx.targets.control) {
              tweenCssColor(ctx.targets.control, "var(--color-foreground)", { clearOnComplete: true });
            }
            return undefined;
          },
        },
      }}
    />
  );
}
