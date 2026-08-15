import { useEffect, useState } from "react";
import gsap from "gsap";

import { ColorSlider } from "@/components/core/ColorPicker";
import { tweenCssColor } from "@/components/core/utils/gsapMotion";

const TL = { overwrite: "auto" as const, force3D: false };

export function ColorSliderMotionChangeTintDemo() {
  const [value, setValue] = useState(40);

  useEffect(() => {
    const id = window.setInterval(() => {
      setValue((prev) => (prev >= 300 ? 20 : prev + 40));
    }, 1200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <ColorSlider
      channel="hue"
      label="Hue"
      value={value}
      onValueChange={setValue}
      motion={{
        track: {
          change: (ctx) => {
            const tl = gsap.timeline({ ...TL });
            tl.to(ctx.el, { y: -2, duration: 0.1 }, 0);
            tl.to(ctx.el, { y: 0, duration: 0.14 }, 0.1);
            tweenCssColor(ctx.el, "var(--color-primary)");
            return tl;
          },
        },
      }}
    />
  );
}
