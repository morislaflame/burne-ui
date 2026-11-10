import { Expandable } from "@/components/core/Expandable";
import { Text } from "@/components/core/Text";

export function ExpandableMotionBodyDemo() {
  return (
    <Expandable
      className="max-w-lg"
      title="Panel slot"
      motion={{
        panel: {
          enter: (ctx) =>
            ctx.fromTo(
              { y: 8, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, duration: 0.28, delay: "expand" },
            ),
          leave: { y: 6, autoAlpha: 0, duration: 0.16 },
        },
      }}
    >
      <Text as="p" textStyle="small" className="text-muted">
        `delay: "expand"` starts `motion.panel` after collapsibleHeight.
      </Text>
    </Expandable>
  );
}
