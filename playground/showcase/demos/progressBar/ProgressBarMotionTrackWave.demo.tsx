import gsap from "gsap";

import { ProgressBar } from "@/components/core/ProgressBar";

const TL = { overwrite: "auto" as const, force3D: false };

export function ProgressBarMotionTrackWaveDemo() {
  return (
    <ProgressBar
      label="Upload"
      value={55}
      showValue
      motion={{
        track: {
          enter: (ctx) => {
            const tl = gsap.timeline({ ...TL });
            tl.fromTo(ctx.el, { opacity: 0 }, { opacity: 1, duration: 0.25 }, 0);
            if (ctx.targets.header) {
              tl.fromTo(ctx.targets.header, { y: 6 }, { y: 0, duration: 0.22 }, 0);
            }
            return tl;
          },
        },
      }}
    />
  );
}
