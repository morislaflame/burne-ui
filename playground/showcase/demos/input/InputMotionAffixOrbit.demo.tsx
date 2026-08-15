import gsap from "gsap";
import { IoAt, IoSearch } from "react-icons/io5";

import { Input } from "@/components/core/Input";

const TL = { overwrite: "auto" as const, force3D: false };

export function InputMotionAffixOrbitDemo() {
  return (
    <Input
      className="w-full max-w-sm"
      label="Affix orbit"
      placeholder="hover the shell"
      hint="Timeline: prefix / suffix / control via ctx.targets"
      prefix={<IoSearch className="icon-base shrink-0" aria-hidden />}
      suffix={<IoAt className="icon-base shrink-0" aria-hidden />}
      motion={{
        shell: {
          hoverIn: (ctx) => {
            const tl = gsap.timeline({ ...TL });
            tl.to(ctx.el, { rotate: -1.4, y: -2, duration: 0.22 }, 0);
            if (ctx.targets.prefix) {
              tl.to(ctx.targets.prefix, { y: -5, rotate: -12, duration: 0.22 }, 0);
            }
            if (ctx.targets.suffix) {
              tl.to(ctx.targets.suffix, { y: -5, rotate: 12, duration: 0.22 }, 0);
            }
            if (ctx.targets.control) {
              tl.to(ctx.targets.control, { x: 6, duration: 0.2 }, 0.05);
            }
            return tl;
          },
          hoverOut: (ctx) => {
            const tl = gsap.timeline({ ...TL });
            tl.to(ctx.el, { rotate: 0, y: 0, duration: 0.18 }, 0);
            if (ctx.targets.prefix) {
              tl.to(ctx.targets.prefix, { y: 0, rotate: 0, duration: 0.18 }, 0);
            }
            if (ctx.targets.suffix) {
              tl.to(ctx.targets.suffix, { y: 0, rotate: 0, duration: 0.18 }, 0);
            }
            if (ctx.targets.control) {
              tl.to(ctx.targets.control, { x: 0, duration: 0.16 }, 0);
            }
            return tl;
          },
        },
      }}
    />
  );
}
