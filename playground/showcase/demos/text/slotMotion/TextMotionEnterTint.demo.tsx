import { Text } from "@/components/core/Text";
import { tweenCssColor } from "@/components/core/utils/gsapMotion";

export function TextMotionEnterTintDemo() {
  return (
    <Text
      variant="header-2"
      motion={{
        root: {
          enter: (ctx) => {
            const tl = ctx.timeline();
            tl.fromTo(ctx.el, { y: 10 }, { y: 0, duration: 0.28 }, 0);
            tweenCssColor(ctx.el, "var(--color-primary)");
            return tl;
          },
        },
      }}
    >
      Enter tint
    </Text>
  );
}
