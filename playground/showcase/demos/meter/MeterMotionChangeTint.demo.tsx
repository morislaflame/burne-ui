import { useEffect, useState } from "react";
import gsap from "gsap";

import { Meter } from "@/components/core/Meter";
import { tweenCssColor } from "@/components/core/utils/gsapMotion";

const TL = { overwrite: "auto" as const, force3D: false };

export function MeterMotionChangeTintDemo() {
  const [value, setValue] = useState(30);

  useEffect(() => {
    const id = window.setInterval(() => {
      setValue((prev) => (prev >= 80 ? 20 : prev + 25));
    }, 1400);
    return () => window.clearInterval(id);
  }, []);

  return (
    <Meter
      label="CPU"
      value={value}
      showValue
      motion={{
        track: {
          change: (ctx) => {
            const tl = gsap.timeline({ ...TL });
            tl.to(ctx.el, { y: -2, duration: 0.12 }, 0);
            tl.to(ctx.el, { y: 0, duration: 0.16 }, 0.12);
            if (ctx.targets.fill) {
              tweenCssColor(ctx.targets.fill, "var(--color-info)");
            }
            return tl;
          },
        },
      }}
    />
  );
}
