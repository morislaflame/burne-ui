import gsap from "gsap";

import { Surface } from "@/components/core/Surface";
import { Text } from "@/components/core/Text";
import { tweenCssColor } from "@/components/core/utils/gsapMotion";

const TL = { overwrite: "auto" as const, force3D: false };

export function SurfaceMotionEnterTintDemo() {
  return (
    <Surface
      padding="large"
      motion={{
        root: {
          enter: (ctx) => {
            const tl = gsap.timeline({ ...TL });
            tl.fromTo(ctx.el, { scale: 0.96 }, { scale: 1, duration: 0.28, ...TL }, 0);
            tweenCssColor(ctx.el, "var(--color-primary)");
            return tl;
          },
        },
      }}
    >
      <Text variant="base">Enter tint</Text>
    </Surface>
  );
}
