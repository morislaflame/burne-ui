import { Checkbox } from "@/components/core/Checkbox";
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

export function CheckboxMotionLabelColorDemo() {
  return (
    <Checkbox
      defaultChecked
      label="Accent label"
      hint="Hint tints with the label."
      error="Error slot follows check / uncheck."
      motion={{
        indicatorFill: {
          check: (ctx) =>
            ctx.fromTo(
              { scale: 0, autoAlpha: 0 },
              { scale: 1, autoAlpha: 1, duration: 0.32, ease: "power2.out" },
            ),
          uncheck: (ctx) => ctx.to({ scale: 0, autoAlpha: 0, duration: 0.2 }),
        },
        label: {
          check: (ctx) => hoverTextColor(ctx.el, "var(--color-primary)", 0.28),
          uncheck: (ctx) => restoreTextColor(ctx.el, 0.22),
        },
        hint: {
          check: (ctx) => hoverTextColor(ctx.el, "var(--color-primary)", 0.28),
          uncheck: (ctx) => restoreTextColor(ctx.el, 0.22),
        },
        error: {
          check: (ctx) => ctx.to({ y: 0, duration: 0.18 }),
          uncheck: (ctx) =>
            ctx.fromTo({ y: -3 }, { y: 0, duration: 0.2, ease: "power2.out" }),
        },
      }}
    />
  );
}
