import { Button } from "@/components/core/Button";
import { Tooltip } from "@/components/core/Tooltip";

export function TooltipMotionSlideYDemo() {
  return (
    <Tooltip
      delayShowMs={0}
      motion={{
        content: {
          enter: (ctx) =>
            ctx.fromTo(
              { y: 8, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.22,
                ease: "power2.out",
              },
            ),
          leave: {
            y: 8,
            autoAlpha: 0,
            duration: 0.16,
          },
        },
      }}
    >
      <Tooltip.Trigger>
        <Button variant="primary" type="button">
          Slide y
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content>Custom enter/leave factory</Tooltip.Content>
    </Tooltip>
  );
}
