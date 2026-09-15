import gsap from "gsap";

import { Loading } from "@/components/core/Loading";
import type { MotionContext } from "@/components/core/utils/slotMotion";

function blurIn(ctx: MotionContext) {
  if (ctx.reduced) return;
  ctx.onCleanup(() => {
    gsap.killTweensOf(ctx.el);
    gsap.set(ctx.el, { filter: "blur(0px)" });
  });
  return gsap.fromTo(
    ctx.el,
    { filter: "blur(8px)" },
    {
      filter: "blur(0px)",
      duration: 0.55,
      ease: "power2.out",
      overwrite: "auto",
      force3D: false,
    },
  );
}

export function LoadingMotionFilterPulseDemo() {
  return (
    <Loading
      size="large"
      label="Loading"
      motion={{
        spinner: { enter: blurIn },
      }}
    />
  );
}
