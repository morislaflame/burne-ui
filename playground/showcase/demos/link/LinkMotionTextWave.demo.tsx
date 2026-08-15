import gsap from "gsap";

import { Link } from "@/components/core/Link";

import { preventNav } from "../../shared/utils";

const TL = { overwrite: "auto" as const, force3D: false };

export function LinkMotionTextWaveDemo() {
  return (
    <Link
      href="#"
      onClick={preventNav}
      underline
      showDefaultIcon
      motion={{
        root: {
          hoverIn: (ctx) => {
            const tl = gsap.timeline({ ...TL });
            tl.to(ctx.el, { y: -2, rotate: -1.2, duration: 0.22 }, 0);
            if (ctx.targets.text) {
              tl.to(ctx.targets.text, { x: 4, duration: 0.2 }, 0.04);
            }
            if (ctx.targets.icon) {
              tl.to(ctx.targets.icon, { rotate: 18, duration: 0.22 }, 0);
            }
            return tl;
          },
          hoverOut: (ctx) => {
            const tl = gsap.timeline({ ...TL });
            tl.to(ctx.el, { y: 0, rotate: 0, duration: 0.18 }, 0);
            if (ctx.targets.text) {
              tl.to(ctx.targets.text, { x: 0, duration: 0.16 }, 0);
            }
            if (ctx.targets.icon) {
              tl.to(ctx.targets.icon, { rotate: 0, duration: 0.18 }, 0);
            }
            return tl;
          },
        },
      }}
    >
      Text wave
    </Link>
  );
}
