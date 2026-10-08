import gsap from "gsap";

import { PinInput } from "@/components/core/PinInput";

export function PinInputMotionOriginDemo() {
  return (
    <PinInput
      label="Code"
      length={4}
      motion={{
        field: {
          hoverIn: (ctx) =>
            gsap.fromTo(
              ctx.el,
              { scale: 0.92, transformOrigin: "50% 50%" },
              { scale: 1, duration: 0.22, overwrite: "auto", force3D: false },
            ),
          hoverOut: (ctx) =>
            gsap.to(ctx.el, { scale: 1, duration: 0.16, overwrite: "auto", force3D: false }),
        },
      }}
    />
  );
}
