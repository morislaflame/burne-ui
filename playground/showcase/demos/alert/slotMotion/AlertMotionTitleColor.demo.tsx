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

export function AlertMotionTitleColorDemo() {
  return (
    <Alert
      status="info"
      title="Primary on hover"
      description="Title color tweens to --color-primary, then restores."
      motion={{
        title: {
          hoverIn: (ctx) => hoverTextColor(ctx.el, "var(--color-primary)"),
          hoverOut: (ctx) => restoreTextColor(ctx.el),
        },
      }}
    />
  );
}
