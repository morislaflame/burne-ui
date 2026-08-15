import gsap from "gsap";

import { Text } from "@/components/core/Text";

const TL = { overwrite: "auto" as const, force3D: false };

export function TextMotionRootWaveDemo() {
  return (
    <Text
      variant="large"
      motion={{
        root: {
          enter: (ctx) =>
            gsap.fromTo(ctx.el, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.35, ...TL }),
          hoverIn: (ctx) => gsap.to(ctx.el, { y: -3, duration: 0.2, ...TL }),
          hoverOut: (ctx) => gsap.to(ctx.el, { y: 0, duration: 0.18, ...TL }),
        },
      }}
    >
      Enter wave
    </Text>
  );
}
