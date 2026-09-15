import { ToggleButton } from "@/components/core/ToggleButton";
import { tweenCssColor } from "@/components/core/utils/gsapMotion";

export function ToggleButtonMotionTextTintDemo() {
  return (
    <ToggleButton
      variant="outline"
      motion={{
        text: {
          check: (ctx) => tweenCssColor(ctx.el, "var(--color-primary)"),
          uncheck: (ctx) =>
            tweenCssColor(ctx.el, "var(--color-foreground)", { clearOnComplete: true }),
        },
      }}
    >
      Text tint
    </ToggleButton>
  );
}
