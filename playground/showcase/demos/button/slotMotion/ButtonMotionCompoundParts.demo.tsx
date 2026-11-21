import { IoRocketOutline } from "react-icons/io5";

import { Button } from "@/components/core/Button";
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
          hoverIn: (ctx) => ctx.to({ y: -3, duration: 0.22 }),
          hoverOut: (ctx) => ctx.to({ y: 0, duration: 0.2 }),
          pressIn: (ctx) => ctx.to({ scale: 0.97, duration: 0.12 }),
          pressOut: (ctx) => ctx.to({ scale: 1, duration: 0.16 }),
        },
        icon: {
          hoverIn: (ctx) =>
            ctx.to({ x: 2, rotation: -12, duration: 0.32, ease: "back.out(1.8)" }),
          hoverOut: (ctx) => ctx.to({ x: 0, rotation: 0, duration: 0.2 }),
          pressIn: { scale: 0.86, duration: 0.12 },
          pressOut: { scale: 1, duration: 0.16 },
        },
        text: {
          hoverIn: (ctx) => {
            const tl = ctx.timeline();
            tl.to(ctx.el, { x: 4, duration: 0.28 }, 0);
            tl.add(hoverTextColor(ctx.el, "var(--color-primary)", 0.28), 0);
            return tl;
          },
          hoverOut: (ctx) => {
            const tl = ctx.timeline();
            tl.to(ctx.el, { x: 0, duration: 0.2 }, 0);
            tl.add(restoreTextColor(ctx.el, 0.2), 0);
            return tl;
          },
        },
      }}
    >
      <Button.Label>
        <Button.Icon className="text-primary">
          <IoRocketOutline aria-hidden />
        </Button.Icon>
        <Button.Text className="font-w-strong">
          Launch workspace
        </Button.Text>
      </Button.Label>
    </Button>
  );
}
