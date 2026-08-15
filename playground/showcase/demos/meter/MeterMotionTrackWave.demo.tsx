import gsap from "gsap";

import { Meter } from "@/components/core/Meter";

const TL = { overwrite: "auto" as const, force3D: false };

export function MeterMotionTrackWaveDemo() {
  return (
    <Meter
      label="Storage"
      value={64}
      showValue
      motion={{
        track: {
          enter: (ctx) => {
            const tl = gsap.timeline({ ...TL });
            tl.fromTo(ctx.el, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.28 }, 0);
            if (ctx.targets.value) {
              tl.fromTo(ctx.targets.value, { y: 4 }, { y: 0, duration: 0.22 }, 0.04);
            }
            return tl;
          },
        },
      }}
    />
  );
}
