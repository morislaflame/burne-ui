import gsap from "gsap";

import { Surface } from "@/components/core/Surface";
import { Text } from "@/components/core/Text";

const TL = { overwrite: "auto" as const, force3D: false };

export function SurfaceMotionRootWaveDemo() {
  return (
    <Surface
      padding="large"
      motion={{
        root: {
          enter: (ctx) =>
            gsap.fromTo(ctx.el, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ...TL }),
          hoverIn: (ctx) => gsap.to(ctx.el, { y: -4, duration: 0.2, ...TL }),
          hoverOut: (ctx) => gsap.to(ctx.el, { y: 0, duration: 0.18, ...TL }),
        },
      }}
    >
      <Text variant="base">Surface wave</Text>
    </Surface>
  );
}
