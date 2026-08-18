import { Breadcrumbs } from "@/components/core/Breadcrumbs";
import { tweenCssColor } from "@/components/core/utils/gsapMotion";

import { preventNav } from "../../shared/utils";

export function BreadcrumbsMotionTextTintDemo() {
  return (
    <Breadcrumbs
      collapse={false}
      motion={{
        itemLinkText: {
          hoverIn: (ctx) => {
            const tl = ctx.timeline();
            tl.to(ctx.el, { y: -1, duration: 0.16 }, 0);
            tweenCssColor(ctx.el, "var(--color-primary)");
            return tl;
          },
          hoverOut: (ctx) => {
            const tl = ctx.timeline();
            tl.to(ctx.el, { y: 0, duration: 0.14 }, 0);
            tweenCssColor(ctx.el, "var(--color-foreground)", { clearOnComplete: true });
            return tl;
          },
        },
        ellipsisLiftWrapper: {
          pressIn: (ctx) =>
            ctx.to({ rotate: 18, scale: 0.9, duration: 0.16, ease: "back.out(1.8)" }),
          pressOut: (ctx) =>
            ctx.to({ rotate: 0, scale: 1, duration: 0.18, ease: "power2.inOut" }),
        },
      }}
    >
      <Breadcrumbs.List>
        <Breadcrumbs.Item href="#" onClick={preventNav}>
          Home
        </Breadcrumbs.Item>
        <Breadcrumbs.Item href="#" onClick={preventNav}>
          Library
        </Breadcrumbs.Item>
        <Breadcrumbs.Item href="#" onClick={preventNav}>
          Core
        </Breadcrumbs.Item>
        <Breadcrumbs.Item href="#" onClick={preventNav}>
          Navigation
        </Breadcrumbs.Item>
        <Breadcrumbs.Item current>Text tint</Breadcrumbs.Item>
      </Breadcrumbs.List>
    </Breadcrumbs>
  );
}
