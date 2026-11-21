import { IoHeartOutline } from "react-icons/io5";

import { ToggleButton } from "@/components/core/ToggleButton";
import { tweenCssColor } from "@/components/core/utils/gsapMotion";

export function ToggleButtonMotionPerPartDemo() {
  return (
    <ToggleButton variant="outline">
      <ToggleButton.IconStart
        motion={{
          check: (ctx) =>
            ctx.fromTo(
              { rotation: -90, scale: 0.6 },
              { rotation: 0, scale: 1, duration: 0.4, ease: "back.out(2.1)" },
            ),
          uncheck: (ctx) =>
            ctx.to({ rotation: 90, scale: 0.7, duration: 0.18, ease: "power2.in" }),
        }}
      >
        <IoHeartOutline aria-hidden />
      </ToggleButton.IconStart>
      <ToggleButton.Text
        motion={{
          check: (ctx) => tweenCssColor(ctx.el, "var(--color-primary)"),
          uncheck: (ctx) =>
            tweenCssColor(ctx.el, "var(--color-foreground)", { clearOnComplete: true }),
        }}
      >
        Like
      </ToggleButton.Text>
    </ToggleButton>
  );
}
