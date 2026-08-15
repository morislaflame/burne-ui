import gsap from "gsap";

import { Button } from "@/components/core/Button";

export function ButtonMotionWiggleDemo() {
  return (
    <Button
      variant="secondary"
      motion={{
        root: {
          hoverIn: (ctx) =>
            gsap.to(ctx.el, {
              rotate: 2,
              duration: 0.28,
              yoyo: true,
              repeat: -1,
              ease: "sine.inOut",
              overwrite: "auto",
              force3D: false,
            }),
          hoverOut: (ctx) =>
            gsap.to(ctx.el, {
              rotate: 0,
              duration: 0.18,
              overwrite: "auto",
              force3D: false,
            }),
        },
      }}
    >
      Wiggle hover
    </Button>
  );
}
