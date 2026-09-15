import gsap from "gsap";

import { Input } from "@/components/core/Input";
import { tweenCssColor } from "@/components/core/utils/gsapMotion";

export function InputMotionPasswordRevealDemo() {
  return (
    <Input
      className="w-full max-w-sm"
      inputType="password"
      label="Password reveal"
      defaultValue="secret-token"
      hint="Toggle hover spin + press timeline on control"
      motion={{
        passwordToggle: {
          hoverIn: (ctx) =>
            ctx.to({ rotate: 180, scale: 1.18, duration: 0.28, ease: "back.out(1.6)" }),
          hoverOut: (ctx) =>
            ctx.to({ rotate: 0, scale: 1, duration: 0.2, ease: "power2.inOut" }),
        },
        shell: {
          pressIn: (ctx) => {
            const tl = ctx.timeline();
            tl.to(ctx.el, { scale: 0.97, duration: 0.1, yoyo: true, repeat: 1, ease: "power2.inOut" }, 0);
            if (ctx.targets.control) {
              tl.add(
                gsap.to(ctx.targets.control, { letterSpacing: "0.14em", duration: 0.18, paused: true }),
                0,
              );
              tweenCssColor(ctx.targets.control, "var(--color-primary)");
            }
            return tl;
          },
          pressOut: (ctx) => {
            if (!ctx.targets.control) return undefined;
            tweenCssColor(ctx.targets.control, "var(--color-foreground)", { clearOnComplete: true });
            return gsap.to(ctx.targets.control, { letterSpacing: "0em", duration: 0.16 });
          },
        },
      }}
    />
  );
}
