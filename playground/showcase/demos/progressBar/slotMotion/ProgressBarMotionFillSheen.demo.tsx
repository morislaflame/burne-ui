import gsap from "gsap";

import { ProgressBar } from "@/components/core/ProgressBar";
import type { MotionContext } from "@/components/core/utils/slotMotion";

function sheen(ctx: MotionContext) {
  const fill = ctx.targets.fill;
  if (!fill || ctx.reduced) return;
  ctx.onCleanup(() => {
    gsap.killTweensOf(fill);
    gsap.set(fill, {
      backgroundImage: "none",
      backgroundPosition: "0% 50%",
      backgroundSize: "auto",
    });
  });
  gsap.set(fill, {
    backgroundImage:
      "linear-gradient(90deg, transparent 0%, color-mix(in srgb, white 55%, transparent) 42%, transparent 72%)",
    backgroundSize: "220% 100%",
    backgroundPosition: "-80% 50%",
    backgroundRepeat: "no-repeat",
    force3D: false,
  });
  return gsap.to(fill, {
    backgroundPosition: "180% 50%",
    duration: 0.9,
    ease: "power2.inOut",
    overwrite: "auto",
    force3D: false,
  });
}

export function ProgressBarMotionFillSheenDemo() {
  return (
    <ProgressBar
      className="w-full max-w-sm"
      label="Upload"
      showValue
      value={68}
      size="large"
      motion={{
        track: { enter: sheen },
      }}
    />
  );
}
