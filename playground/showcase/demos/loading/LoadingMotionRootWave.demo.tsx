import gsap from "gsap";

import { Loading } from "@/components/core/Loading";

const TL = { overwrite: "auto" as const, force3D: false };

export function LoadingMotionRootWaveDemo() {
  return (
    <Loading
      type="dots"
      motion={{
        root: {
          enter: (ctx) => {
            const tl = gsap.timeline({ ...TL });
            tl.fromTo(ctx.el, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3 }, 0);
            if (ctx.targets.dots) {
              tl.fromTo(ctx.targets.dots, { scale: 0.8 }, { scale: 1, duration: 0.24 }, 0.04);
            }
            return tl;
          },
        },
      }}
    />
  );
}
