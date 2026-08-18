import { Button } from "@/components/core/Button";
import { Tooltip } from "@/components/core/Tooltip";

export function TooltipMotionPanelDemo() {
  return (
    <Tooltip
      delayShowMs={0}
      motion={{
        panel: {
          enter: (ctx) =>
            ctx.fromTo(
              { scale: 0.92, opacity: 0 },
              { scale: 1, opacity: 1, duration: 0.24, ease: "back.out(1.4)" },
            ),
          leave: { scale: 0.96, autoAlpha: 0, duration: 0.14 },
        },
      }}
    >
      <Tooltip.Trigger>
        <Button variant="outline" type="button">
          Panel slot
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content>
        <Tooltip.Title>Panel</Tooltip.Title>
        <Tooltip.Description>Animate Tooltip.Panel independently from content.</Tooltip.Description>
      </Tooltip.Content>
    </Tooltip>
  );
}
