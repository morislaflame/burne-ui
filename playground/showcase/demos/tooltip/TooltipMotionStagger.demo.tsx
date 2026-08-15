import gsap from "gsap";
import { IoHelpCircleOutline } from "react-icons/io5";

import { Button } from "@/components/core/Button";
import { Tooltip } from "@/components/core/Tooltip";

function part(root: ParentNode, name: string): HTMLElement | null {
  const node = root.querySelector(`[data-part="${name}"]`);
  return node instanceof HTMLElement ? node : null;
}

const TL_DEFAULTS = { overwrite: "auto" as const, force3D: false };

export function TooltipMotionStaggerDemo() {
  return (
    <Tooltip
      delayShowMs={0}
      status="info"
      side="top"
      classNames={{
        content: "shadow-token-large",
        panel: "border-token-info",
        indicator: "text-info",
        title: "text-info font-w-strong",
        description: "text-foreground/75",
      }}
      motion={{
        content: {
          enter: (ctx) => {
            const tl = gsap.timeline({ defaults: TL_DEFAULTS });
            const indicator = part(ctx.el, "indicator");
            const title = part(ctx.el, "title");
            const description = part(ctx.el, "description");
            tl.fromTo(
              ctx.el,
              { y: 12, opacity: 0, scale: 0.96 },
              { y: 0, opacity: 1, scale: 1, duration: 0.24, ease: "power2.out" },
              0,
            );
            if (indicator) {
              tl.fromTo(
                indicator,
                { rotate: -18, scale: 0.72 },
                { rotate: 0, scale: 1, duration: 0.34, ease: "back.out(1.8)" },
                0.04,
              );
            }
            if (title) tl.fromTo(title, { y: 8 }, { y: 0, duration: 0.26 }, 0.08);
            if (description) {
              tl.fromTo(description, { y: 10 }, { y: 0, duration: 0.28 }, 0.14);
            }
            return tl;
          },
          leave: (ctx) => {
            const tl = gsap.timeline({ defaults: { ...TL_DEFAULTS, duration: 0.16 } });
            const indicator = part(ctx.el, "indicator");
            const title = part(ctx.el, "title");
            const description = part(ctx.el, "description");
            tl.to(ctx.el, { y: 8, autoAlpha: 0, scale: 0.97, ease: "power2.in" }, 0);
            if (indicator) tl.to(indicator, { rotate: 12, scale: 0.85 }, 0);
            if (title) tl.to(title, { y: -4 }, 0);
            if (description) tl.to(description, { y: -6 }, 0);
            return tl;
          },
        },
      }}
    >
      <Tooltip.Trigger asChild>
        <Button variant="outline" type="button" aria-label="Staggered tooltip">
          <IoHelpCircleOutline aria-hidden className="icon-mid" />
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content showArrow>
        <Tooltip.Arrow />
        <Tooltip.Indicator data-part="indicator" />
        <Tooltip.Title data-part="title">Staggered slots</Tooltip.Title>
        <Tooltip.Description data-part="description">
          Indicator pops, then title, then description.
        </Tooltip.Description>
      </Tooltip.Content>
    </Tooltip>
  );
}
