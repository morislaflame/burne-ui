import gsap from "gsap";

import { Text } from "@/components/core/Text";
import { tweenCssColor } from "@/components/core/utils/gsapMotion";

const TL = { overwrite: "auto" as const, force3D: false };

export function TextMotionEnterTintDemo() {
  return (
    <Text
      variant="header-2"
      motion={{
        root: {
          enter: (ctx) => {
            const tl = gsap.timeline({ ...TL });
            tl.fromTo(ctx.el, { y: 10 }, { y: 0, duration: 0.28 }, 0);
            tweenCssColor(ctx.el, "var(--color-primary)");
            return tl;
          },
        },
      }}
    >
      Enter tint
    </Text>
  );
}
