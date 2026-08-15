import gsap from "gsap";

import { Alert } from "@/components/core/Alert";
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

export function AlertMotionPerPartDemo() {
  return (
    <Alert status="success">
      <Alert.Message>
        <Alert.Indicator
          motion={{
            hoverIn: (ctx) =>
              gsap.to(ctx.el, {
                rotate: 15,
                scale: 1.12,
                duration: 0.28,
                ease: "back.out(2)",
                overwrite: "auto",
                force3D: false,
              }),
            hoverOut: (ctx) =>
              gsap.to(ctx.el, {
                rotate: 0,
                scale: 1,
                duration: 0.2,
                overwrite: "auto",
                force3D: false,
              }),
          }}
        />
        <Alert.Content>
          <Alert.Title>Per-part pointers</Alert.Title>
          <Alert.Description
            motion={{
              hoverIn: (ctx) => hoverTextColor(ctx.el, "var(--color-success)"),
              hoverOut: (ctx) => restoreTextColor(ctx.el),
            }}
          >
            Hover this line — it picks up the success token.
          </Alert.Description>
        </Alert.Content>
        <Alert.Action
          motion={{
            hoverIn: { scale: 1.06, duration: 0.2 },
            hoverOut: { scale: 1, duration: 0.18 },
          }}
        >
          <Button variant="outline" size="small" className="shrink-0">
            Retry
          </Button>
        </Alert.Action>
      </Alert.Message>
    </Alert>
  );
}
