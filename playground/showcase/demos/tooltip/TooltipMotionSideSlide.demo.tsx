import { IoSparklesOutline } from "react-icons/io5";

import { Button } from "@/components/core/Button";
import { Tooltip } from "@/components/core/Tooltip";
import { tweenCssColor } from "@/components/core/utils/gsapMotion";

export function TooltipMotionSideSlideDemo() {
  return (
    <Tooltip
      delayShowMs={0}
      variant="secondary"
      side="bottom"
      classNames={{
        panel: "border-token-primary bg-secondary",
        glossContent: "gap-y-xsmall",
      }}
      motion={{
        content: {
          enter: (ctx) => {
            const tl = ctx.timeline();
            const title = ctx.getTarget("title");
            const description = ctx.getTarget("description");
            tl.fromTo(
              ctx.el,
              { x: 16, opacity: 0, rotate: 2 },
              {
                x: 0,
                opacity: 1,
                rotate: 0,
                duration: 0.28,
                ease: "power3.out",
              },
              0,
            );
            if (title) {
              tl.fromTo(title, { x: 10 }, { x: 0, duration: 0.26 }, 0.06);
              tl.add(
                tweenCssColor(title, "var(--color-primary)", { duration: 0.28 }),
                0.04,
              );
            }
            if (description) {
              tl.fromTo(description, { x: 14, opacity: 0.4 }, { x: 0, opacity: 1, duration: 0.3 }, 0.12);
            }
            return tl;
          },
          leave: (ctx) => {
            const tl = ctx.timeline();
            const title = ctx.getTarget("title");
            const description = ctx.getTarget("description");
            tl.to(ctx.el, { x: 12, autoAlpha: 0, rotate: 1, duration: 0.16, ease: "power2.in" }, 0);
            if (title) tl.to(title, { x: 8, duration: 0.16 }, 0);
            if (description) tl.to(description, { x: 10, autoAlpha: 0.4, duration: 0.16 }, 0);
            return tl;
          },
        },
      }}
    >
      <Tooltip.Trigger asChild>
        <Button variant="secondary" type="button" icon={<IoSparklesOutline aria-hidden />}>
          Side slide
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content showArrow>
        <Tooltip.Arrow />
        <Tooltip.Title className="font-w-strong">
          Custom enter
        </Tooltip.Title>
        <Tooltip.Description className="text-muted">
          Title picks up --color-primary while the bubble slides in.
        </Tooltip.Description>
      </Tooltip.Content>
    </Tooltip>
  );
}
