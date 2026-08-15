import { useEffect, useState } from "react";
import gsap from "gsap";

import { ProgressBar } from "@/components/core/ProgressBar";
import { tweenCssColor } from "@/components/core/utils/gsapMotion";

const TL = { overwrite: "auto" as const, force3D: false };

export function ProgressBarMotionChangeTintDemo() {
  const [value, setValue] = useState(15);

  useEffect(() => {
    const id = window.setInterval(() => {
      setValue((prev) => (prev >= 90 ? 10 : prev + 20));
    }, 1200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <ProgressBar
      label="Sync"
      value={value}
      showValue
      motion={{
        track: {
          change: (ctx) => {
            const tl = gsap.timeline({ ...TL });
            tl.to(ctx.el, { scale: 1.02, duration: 0.12 }, 0);
            tl.to(ctx.el, { scale: 1, duration: 0.16 }, 0.12);
            if (ctx.targets.fill) tweenCssColor(ctx.targets.fill, "var(--color-success)");
            return tl;
          },
        },
      }}
    />
  );
}
