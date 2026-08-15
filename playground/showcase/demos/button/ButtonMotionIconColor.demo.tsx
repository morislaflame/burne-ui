import gsap from "gsap";
import { IoCheckmarkCircleOutline } from "react-icons/io5";

import { Button } from "@/components/core/Button";
import { tweenCssColor } from "@/components/core/utils/gsapMotion";

function iconSvg(root: ParentNode): SVGElement | null {
  return root.querySelector("svg");
}

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

export function ButtonMotionIconColorDemo() {
  return (
    <Button
      variant="outline"
      status="success"
      icon={<IoCheckmarkCircleOutline aria-hidden />}
      classNames={{
        root: "border-token-success min-w-button-mid",
        icon: "text-success",
        text: "font-w-strong",
      }}
      motion={{
        root: {
          hoverIn: (ctx) => {
            const tl = gsap.timeline({
              defaults: { overwrite: "auto", force3D: false },
            });
            const svg = iconSvg(ctx.el);
            tl.to(ctx.el, { y: -2, duration: 0.2 }, 0);
            if (svg) {
              tl.to(
                svg,
                { rotate: 16, scale: 1.14, duration: 0.32, ease: "back.out(2)" },
                0,
              );
            }
            tl.add(hoverTextColor(ctx.el, "var(--color-success)", 0.28), 0);
            return tl;
          },
          hoverOut: (ctx) => {
            const tl = gsap.timeline({
              defaults: { overwrite: "auto", force3D: false, duration: 0.2 },
            });
            const svg = iconSvg(ctx.el);
            tl.to(ctx.el, { y: 0 }, 0);
            if (svg) tl.to(svg, { rotate: 0, scale: 1 }, 0);
            tl.add(restoreTextColor(ctx.el, 0.2), 0);
            return tl;
          },
        },
      }}
    >
      Confirm deploy
    </Button>
  );
}
