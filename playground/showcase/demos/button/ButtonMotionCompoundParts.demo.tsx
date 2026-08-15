import gsap from "gsap";
import { IoRocketOutline } from "react-icons/io5";

import { Button } from "@/components/core/Button";
import { killMotion, tweenCssColor } from "@/components/core/utils/gsapMotion";

function part(root: ParentNode, name: string): HTMLElement | null {
  const node = root.querySelector(`[data-part="${name}"]`);
  return node instanceof HTMLElement ? node : null;
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

export function ButtonMotionCompoundPartsDemo() {
  return (
    <Button
      variant="secondary"
      classNames={{
        root: "rounded-large px-large",
        label: "gap-small",
      }}
      motion={{
        root: {
          hoverIn: (ctx) => {
            const tl = gsap.timeline({
              defaults: { overwrite: "auto", force3D: false },
            });
            const icon = part(ctx.el, "icon");
            const text = part(ctx.el, "text");
            tl.to(ctx.el, { y: -3, duration: 0.22 }, 0);
            if (icon) {
              tl.to(
                icon,
                { x: 2, rotate: -12, duration: 0.32, ease: "back.out(1.8)" },
                0,
              );
            }
            if (text) {
              tl.to(text, { x: 4, duration: 0.28 }, 0.04);
              tl.add(hoverTextColor(text, "var(--color-primary)", 0.28), 0);
            }
            return tl;
          },
          hoverOut: (ctx) => {
            const tl = gsap.timeline({
              defaults: { overwrite: "auto", force3D: false, duration: 0.2 },
            });
            const icon = part(ctx.el, "icon");
            const text = part(ctx.el, "text");
            tl.to(ctx.el, { y: 0 }, 0);
            if (icon) tl.to(icon, { x: 0, rotate: 0 }, 0);
            if (text) {
              tl.to(text, { x: 0 }, 0);
              tl.add(restoreTextColor(text, 0.2), 0);
            }
            return tl;
          },
          pressIn: (ctx) => {
            const icon = part(ctx.el, "icon");
            const tl = gsap.timeline({
              defaults: { overwrite: "auto", force3D: false, duration: 0.12 },
            });
            tl.to(ctx.el, { scale: 0.97 }, 0);
            if (icon) tl.to(icon, { scale: 0.86 }, 0);
            return tl;
          },
          pressOut: (ctx) => {
            const icon = part(ctx.el, "icon");
            if (icon) killMotion(icon);
            const tl = gsap.timeline({
              defaults: { overwrite: "auto", force3D: false, duration: 0.16 },
            });
            tl.to(ctx.el, { scale: 1 }, 0);
            if (icon) tl.to(icon, { scale: 1 }, 0);
            return tl;
          },
        },
      }}
    >
      <Button.Label>
        <Button.Icon data-part="icon" className="text-primary">
          <IoRocketOutline aria-hidden />
        </Button.Icon>
        <Button.Text data-part="text" className="font-w-strong">
          Launch workspace
        </Button.Text>
      </Button.Label>
    </Button>
  );
}
