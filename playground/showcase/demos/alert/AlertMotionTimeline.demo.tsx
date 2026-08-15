import gsap from "gsap";

import { Alert } from "@/components/core/Alert";
import { tweenCssColor } from "@/components/core/utils/gsapMotion";

function hoverTextColor(el: HTMLElement, color: string, duration = 0.25) {
  if (!el.dataset.motionColorRest) {
    el.dataset.motionColorRest = getComputedStyle(el).color;
  }
  return tweenCssColor(el, color, { duration });
}

function restoreTextColor(el: HTMLElement, duration = 0.2) {
  const rest = el.dataset.motionColorRest || "var(--color-foreground)";
  return tweenCssColor(el, rest, {
    duration,
    clearOnComplete: true,
    onComplete: () => {
      delete el.dataset.motionColorRest;
    },
  });
}

export function AlertMotionTimelineDemo() {
  return (
    <Alert
      status="danger"
      title="Timeline on root"
      description="Hover the banner — slots stagger, then settle back together."
      motion={{
        root: {
          hoverIn: (ctx) => {
            const tl = gsap.timeline({
              defaults: { overwrite: "auto", force3D: false },
            });
            if (ctx.targets.indicator) {
              tl.to(
                ctx.targets.indicator,
                { rotate: -8, scale: 1.08, duration: 0.28, ease: "back.out(1.6)" },
                0,
              );
            }
            if (ctx.targets.title) {
              tl.add(hoverTextColor(ctx.targets.title, "var(--color-danger)", 0.3), 0);
              tl.to(ctx.targets.title, { y: -3, duration: 0.28 }, 0.05);
            }
            if (ctx.targets.description) {
              tl.to(ctx.targets.description, { y: -2, duration: 0.28 }, 0.1);
            }
            return tl;
          },
          hoverOut: (ctx) => {
            const tl = gsap.timeline({
              defaults: { overwrite: "auto", force3D: false, duration: 0.22 },
            });
            if (ctx.targets.indicator) {
              tl.to(ctx.targets.indicator, { rotate: 0, scale: 1 }, 0);
            }
            if (ctx.targets.title) {
              tl.add(restoreTextColor(ctx.targets.title, 0.22), 0);
              tl.to(ctx.targets.title, { y: 0 }, 0);
            }
            if (ctx.targets.description) {
              tl.to(ctx.targets.description, { y: 0 }, 0);
            }
            return tl;
          },
        },
      }}
    />
  );
}
